import { Module } from '@nestjs/common';
import { TaskifyApiGatewayController } from './taskify-api-gateway.controller';
import { TaskifyApiGatewayService } from './taskify-api-gateway.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from '../../users/src/database/db.config';
import { DBModule } from '../../users/src/database/db.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    UsersModule,
    DBModule,
    ConfigModule.forRoot({ load: [dbConfig] }),
    ProjectsModule,
  ],
  controllers: [TaskifyApiGatewayController],
  providers: [TaskifyApiGatewayService],
})
export class TaskifyApiGatewayModule {}
