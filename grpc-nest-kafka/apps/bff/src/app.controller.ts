import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as Proto from '@repo/protos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getContent(): Promise<{
    date: Proto.date.DateResponse;
    weather: string;
    quote: Proto.quote.QuoteResponse;
  }> {
    console.log('AppController: getContent() called')
    return await this.appService.getContent();
  }
}
