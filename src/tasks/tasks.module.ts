import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { AuthModule } from 'src/auth/auth.module';
import { Task } from './task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule],
  controllers: [TasksController],
  providers: [
    {
      provide: 'ITaskRepository',
      useClass: TaskRepository,
    },
    TasksService,
  ],
})
export class TasksModule {}
