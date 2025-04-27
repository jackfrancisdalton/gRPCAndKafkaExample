import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BFF_PORT } from '@repo/common-config';
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(BFF_PORT ?? 3001);
  console.log(`BFF on http://localhost:${BFF_PORT ?? 3001}`);
}
bootstrap();
