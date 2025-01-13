import { NestFactory } from '@nestjs/core';
import { TaskifyApiGatewayModule } from './taskify-api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(TaskifyApiGatewayModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
