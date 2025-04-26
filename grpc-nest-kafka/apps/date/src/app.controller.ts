import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import * as Proto from '@repo/protos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

    @GrpcMethod('DateService', 'GetCurrentDate')
    getCurrentDate(_: Proto.date.DateRequest): Proto.date.DateResponse {
      console.log('AppController: getCurrentDate() called')
      return this.appService.getCurrentDate();
    }
}
