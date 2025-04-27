import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DATE_SERVICE_GRPC_URL, WEATHER_SERVICE_GRPC_URL } from '@repo/common-config';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DATE_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'date',
          protoPath: require.resolve('@repo/protos/src/protos/date.proto'),
          url: DATE_SERVICE_GRPC_URL || '0.0.0.0:50051',
        },
      },
      {
        name: 'WEATHER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'weather',
          protoPath: require.resolve('@repo/protos/src/protos/weather.proto'),
          url: WEATHER_SERVICE_GRPC_URL || '0.0.0.0:50053',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
