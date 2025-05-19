import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import * as Proto from '@repo/protos';
import { createLoggingClient } from '@repo/grpc-logger'

interface DateService {
  getCurrentDate(request: Proto.date.DateRequest): Observable<Proto.date.DateResponse>;
}

@Injectable()
export class AppService {
  private dateClient: DateService;

  constructor(
    @Inject('DATE_SERVICE') private dateGrpcClient: ClientGrpc,
  ) {
    this.dateClient    = createLoggingClient(
      this.dateGrpcClient.getService<DateService>('DateService'),
      'DateService',
    );
  }

  async getQuote(weather: string): Promise<Proto.quote.QuoteResponse> {  
    const dateRes    = await firstValueFrom(this.dateClient.getCurrentDate({}));
    
    const map = {
      sunny:  ['Sunshine is the best medicine.', 'Unknown', '2020-06-01'],
      cloudy: ['Every cloud has a silver lining.', 'Proverb', '1900-01-01'],
      'slightly rainy': ['Life isn’t about waiting for the storm to pass.', 'Vivian Greene', '2003-09-10'],
      windy:  ['The winds of grace are always blowing.', 'Thomas Fuller', '1642-01-01'],
    };

    const key = weather in map ? weather : 'sunny';
    const [quote, author, since] = map[key];
    const daysSince = Math.floor((new Date(dateRes.iso).getTime() - new Date(since).getTime())/(1000*60*60*24));

    const res = { quote, author, daysSince };
    
    return res;
  }
}
