import { NestFactory } from '@nestjs/core';
import { TasksAppModule } from './tasks-app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TasksAppModule, {
    transport: Transport.TCP,
    options: {
      port: 4003,
    },
  });
  await app.listen();
}
bootstrap();
