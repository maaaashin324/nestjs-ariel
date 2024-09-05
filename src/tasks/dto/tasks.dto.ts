import { IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../task.model';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;

  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
  }
}

export class UpdateTaskStatusDto {
  status: TaskStatus;
}

export class GetTasksFilterDto {
  status: TaskStatus;
  search: string;
}
