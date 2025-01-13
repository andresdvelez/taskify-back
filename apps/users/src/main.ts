import { NestFactory } from '@nestjs/core';
import { UsersAppModule } from './users-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersAppModule,
    {
      transport: Transport.TCP,
      options: {
        port: 4001,
      },
    },
  );
  await app.listen();
}
bootstrap();
