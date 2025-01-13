import { NestFactory } from '@nestjs/core';
import { ProjectsAppModule } from './projects-app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ProjectsAppModule, {
    transport: Transport.TCP,
    options: {
      port: 4002,
    },
  });
  await app.listen();
}
bootstrap();
