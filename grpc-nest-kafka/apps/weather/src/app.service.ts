import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import * as Proto from '@repo/protos';
import { firstValueFrom, Observable } from 'rxjs';
import { createLoggingClient } from '@repo/grpc-logger'

interface DateService {
  getCurrentDate(request: Proto.date.DateRequest): Observable<Proto.date.DateResponse>;
}

@Injectable()
export class AppService {
  private dateClient: DateService;

  constructor(@Inject('DATE_SERVICE') private readonly dateGrpcClient: ClientGrpc) {
    this.dateClient = createLoggingClient(
      this.dateGrpcClient.getService<DateService>('DateService'),
      'DateService',
    );
  }

  async getWeather(): Promise<Proto.weather.WeatherResponse> {
    console.log('AppService: getWeather() called');
    const date = await firstValueFrom(this.dateClient.getCurrentDate({}));
    const options: string[] = ['sunny', 'slightly rainy', 'cloudy', 'windy'];
    const idx = (date.day % options.length);

    const res = { weather: options[idx] || "FAIL" };
    console.log('AppService: getWeather() will return: ', JSON.stringify(res));

    return res;
  }
}
