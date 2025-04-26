import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'weather',
        protoPath: require.resolve('@repo/protos/protos/weather.proto'),
        url: process.env.QUOTE_OF_THE_DAY_GRPC_URL || '0.0.0.0:50053',
      },
    },
  );
  await app.listen();
  console.log('Weather gRPC server listening');
}
bootstrap();