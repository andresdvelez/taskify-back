import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtStrategy } from '@taskify/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    ClientsModule.register([
      {
        name: 'PROJECTS_CLIENT',
        transport: Transport.TCP,
        options: { port: 4002 },
      },
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, JwtStrategy],
})
export class ProjectsModule {}
