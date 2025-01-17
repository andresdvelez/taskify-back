import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { DBModule } from '@projects/database/db.module';
import { projectsProvider } from './projects.provider';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DBModule, HttpModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ...projectsProvider],
})
export class ProjectsModule {}
