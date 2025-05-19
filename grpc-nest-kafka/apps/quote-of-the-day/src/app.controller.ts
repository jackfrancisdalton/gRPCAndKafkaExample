import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, GrpcMethod, Payload } from '@nestjs/microservices';
import { quote } from '@repo/protos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Note we're storing this value in memory for simplicity, in reality we'd want to propogate the data into say a db in this microservice
  // this approach is purely for demo purposes
  private latest_weather: string = 'unknown';

  @EventPattern('weather-updates')
  handleWeather(@Payload() message: any) {
    this.latest_weather = message.weather;
    console.log('[latest_weather] updated to', this.latest_weather);
  }

  @GrpcMethod('QuoteService', 'GetQuote')
  async getQuote(_: quote.QuoteRequest): Promise<quote.QuoteResponse> {
    console.log('AppController: getQuote() called');
    return this.appService.getQuote(this.latest_weather);
  }
}
