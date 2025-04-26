import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import { weather } from '@repo/protos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('WeatherService', 'GetWeather')
  async getWeather(_: weather.WeatherRequest): Promise<weather.WeatherResponse> {
    console.log('AppController: getWeather() called');
    return this.appService.getWeather();
  }
}
