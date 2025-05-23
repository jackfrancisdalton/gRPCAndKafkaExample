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
interface QuoteService {
  getQuote(request: Proto.quote.QuoteRequest): Observable<Proto.quote.QuoteResponse>;
}

@Injectable()
export class AppService {

  private dateClient: DateService;
  private weatherClient: WeatherService;
  private quoteClient: QuoteService;
  
  constructor(
    @Inject('DATE_SERVICE') private readonly dateGrpcClient: ClientGrpc,
    @Inject('WEATHER_SERVICE') private readonly weatherCGrpclient: ClientGrpc,
    @Inject('QUOTE_SERVICE') private readonly quoteGrpcClient: ClientGrpc,
  ) {
    this.dateClient    = createLoggingClient(
      this.dateGrpcClient.getService<DateService>('DateService'),
      'DateService',
    );
    this.weatherClient = createLoggingClient(
      this.weatherCGrpclient.getService<WeatherService>('WeatherService'),
      'WeatherService',
    );
    this.quoteClient   = createLoggingClient(
      this.quoteGrpcClient.getService<QuoteService>('QuoteService'),
      'QuoteService',
    );
  }

  async getContent(): Promise<{
    date: Proto.date.DateResponse;
    weather: string;
    quote: Proto.quote.QuoteResponse;
  }> {
    const date    = await firstValueFrom(this.dateClient.getCurrentDate({}));
    const weather = await firstValueFrom(this.weatherClient.getWeather({ date }));
    const quote   = await firstValueFrom(this.quoteClient.getQuote({ date, weather: weather.weather }));

    const res = { date, weather: weather.weather, quote };

    return res;
  }
}
