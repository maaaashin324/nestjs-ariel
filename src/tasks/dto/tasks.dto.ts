import { TaskStatus } from '../task.model';

export class CreateTaskDto {
  title: string;
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
