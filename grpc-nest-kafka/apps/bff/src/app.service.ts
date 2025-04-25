import { Injectable } from '@nestjs/common';
import { FooServiceClient } from '@repo/protos';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(FooServiceClient)
    return 'Hello World!';
  }
}
