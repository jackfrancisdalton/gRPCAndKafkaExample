import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'quote',
        protoPath: require.resolve('@repo/protos/src/protos/quote-of-the-day.proto'),
        url: process.env.QUOTE_OF_THE_DAY_GRPC_URL || '0.0.0.0:50052',
      },
    },
  );
  await app.listen();
  console.log('Quote of the Day gRPC server listening');
}
bootstrap();