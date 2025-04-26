import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'date',             
        protoPath: require.resolve('@repo/protos/protos/date.proto'),
        url: process.env.DATE_GRPC_URL || '0.0.0.0:50051',
      },
    },
  );
  await app.listen();
  console.log('Date gRPC server listening');
}
bootstrap();