import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DATE_SERVICE_GRPC_URL } from '@repo/common-config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'quote-producer',
            brokers: [process.env.KAFKA_BROKER || 'kafka:9092'], // Note we are using host.docker.internal to access kafka outside of the dev container
          },
          producerOnlyMode: true, // we’re only producing messages in this service
        },
      },
      {
        name: 'DATE_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'date',
          protoPath: require.resolve('@repo/protos/src/protos/date.proto'),
          url: DATE_SERVICE_GRPC_URL || "0.0.0.0:50051",
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
