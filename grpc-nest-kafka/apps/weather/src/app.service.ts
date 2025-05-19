import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc, ClientKafka } from '@nestjs/microservices';
import * as Proto from '@repo/protos';
import { firstValueFrom, Observable } from 'rxjs';
import { createLoggingClient } from '@repo/grpc-logger'
import { Interval } from '@nestjs/schedule';

interface DateService {
  getCurrentDate(request: Proto.date.DateRequest): Observable<Proto.date.DateResponse>;
}

@Injectable()
export class AppService {
  private dateClient: DateService;

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    @Inject('DATE_SERVICE') private readonly dateGrpcClient: ClientGrpc
  ) {
    this.dateClient = createLoggingClient(
      this.dateGrpcClient.getService<DateService>('DateService'),
      'DateService',
    );
  }

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async getWeather(): Promise<Proto.weather.WeatherResponse> {
    const date = await firstValueFrom(this.dateClient.getCurrentDate({}));
    const options: string[] = ['sunny', 'slightly rainy', 'cloudy', 'windy'];
    const idx = (date.minute % options.length);

    return { weather: options[idx] || "FAIL" };
  }

  @Interval(60_000)
  private async publishWeather(): Promise<void> {

    const { weather } = await this.getWeather();

    console.log('[weather] publishing', weather);
    this.kafkaClient.emit('weather-updates', {
      weather,
      timestamp: Date.now(),
    });
  }
}
