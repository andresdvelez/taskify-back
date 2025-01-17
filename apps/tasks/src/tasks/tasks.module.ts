import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { DBModule } from '../database/db.module';
import { tasksProvider } from './tasks.provider';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DBModule, HttpModule],
  controllers: [TasksController],
  providers: [TasksService, ...tasksProvider],
})
export class TasksModule {}
