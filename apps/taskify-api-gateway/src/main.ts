import { NestFactory } from '@nestjs/core';
import { TaskifyApiGatewayModule } from './taskify-api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(TaskifyApiGatewayModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
