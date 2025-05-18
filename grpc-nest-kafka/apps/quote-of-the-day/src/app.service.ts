import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import * as Proto from '@repo/protos';
import { createLoggingClient } from '@repo/grpc-logger'

interface DateService {
  getCurrentDate(request: Proto.date.DateRequest): Observable<Proto.date.DateResponse>;
}

interface WeatherService {
  getWeather(request: Proto.weather.WeatherRequest): Observable<Proto.weather.WeatherResponse>;
}

@Injectable()
export class AppService {
  private dateClient: DateService;
  private weatherClient: WeatherService;

  constructor(
    @Inject('DATE_SERVICE') private dateGrpcClient: ClientGrpc,
    @Inject('WEATHER_SERVICE') private weatherCGrpclient: ClientGrpc,
  ) {
    this.dateClient    = createLoggingClient(
      this.dateGrpcClient.getService<DateService>('DateService'),
      'DateService',
    );
    this.weatherClient = createLoggingClient(
      this.weatherCGrpclient.getService<WeatherService>('WeatherService'),
      'WeatherService',
    );
  }

  async getQuote(): Promise<Proto.quote.QuoteResponse> {
  
    const dateRes    = await firstValueFrom(this.dateClient.getCurrentDate({}));
    const weatherRes = await firstValueFrom(this.weatherClient.getWeather({ date: dateRes }));

    const map = {
      sunny:  ['Sunshine is the best medicine.', 'Unknown', '2020-06-01'],
      cloudy: ['Every cloud has a silver lining.', 'Proverb', '1900-01-01'],
      'slightly rainy': ['Life isn’t about waiting for the storm to pass.', 'Vivian Greene', '2003-09-10'],
      windy:  ['The winds of grace are always blowing.', 'Thomas Fuller', '1642-01-01'],
    };

    const key = weatherRes.weather in map ? weatherRes.weather : 'sunny';
    const [quote, author, since] = map[key];
    const daysSince = Math.floor((new Date(dateRes.iso).getTime() - new Date(since).getTime())/(1000*60*60*24));

    const res = { quote, author, daysSince };
    
    return res;
  }
}
