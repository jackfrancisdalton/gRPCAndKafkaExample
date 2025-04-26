import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import * as Proto from '@repo/protos';
import { firstValueFrom, Observable } from 'rxjs';

interface DateService {
  getCurrentDate(request: Proto.date.DateRequest): Observable<Proto.date.DateResponse>;
}

@Injectable()
export class AppService {
  private dateClient: DateService;

  constructor(@Inject('DATE_SERVICE') private readonly client: ClientGrpc) {
    this.dateClient = this.client.getService<DateService>('DateService');
  }

  async getWeather(): Promise<Proto.weather.WeatherResponse> {
    const date = await firstValueFrom(this.dateClient.getCurrentDate({}));
    const options: string[] = ['sunny', 'slightly rainy', 'cloudy', 'windy'];
    const idx = (date.day % options.length);

    return { weather: options[idx] || "FAIL" };
  }
}
