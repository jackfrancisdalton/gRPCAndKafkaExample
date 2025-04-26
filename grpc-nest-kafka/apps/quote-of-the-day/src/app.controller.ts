import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import { quote } from '@repo/protos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('QuoteService', 'GetQuote')
  async getQuote(_: quote.QuoteRequest): Promise<quote.QuoteResponse> {
    console.log('AppController: getQuote() called');
    return this.appService.getQuote();
  }
}
