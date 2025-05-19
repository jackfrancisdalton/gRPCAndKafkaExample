import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // 1) Create the “host” Nest app (no HTTP)  
  const app = await NestFactory.create(AppModule);

  // 2) Attach the gRPC server
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'quote',
      protoPath: require.resolve(
        '@repo/protos/src/protos/quote-of-the-day.proto',
      ),
      url: process.env.QUOTE_OF_THE_DAY_GRPC_URL || '0.0.0.0:50052',
    },
  });

  // 3) Attach the Kafka consumer/producer
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'weather-consumer',
        brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
      },
      consumer: {
        groupId: 'weather-consumer-group',
      },
    },
  });

  await app.startAllMicroservices();
  console.log('✅ gRPC server and Kafka microservice are up');
}
bootstrap();