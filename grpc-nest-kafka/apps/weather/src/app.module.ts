import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DATE_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'date',
          protoPath: require.resolve('@repo/protos/src/protos/date.proto'),
          url: process.env.DATE_SERVICE_URL || "0.0.0.0:50051",
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
