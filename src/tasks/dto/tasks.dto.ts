import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

export class GetTasksFilterDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus;

  @IsString()
  @IsOptional()
  search: string;
}
