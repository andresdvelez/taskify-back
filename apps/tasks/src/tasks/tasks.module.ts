import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { DBModule } from '../database/db.module';
import { tasksProvider } from './tasks.provider';

@Module({
  imports: [DBModule],
  controllers: [TasksController],
  providers: [TasksService, ...tasksProvider],
})
export class TasksModule {}
