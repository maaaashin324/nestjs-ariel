import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import {
  CreateTaskDto,
  GetTasksFilterDto,
  UpdateTaskStatusDto,
} from './dto/tasks.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksByFilter(filterDto: GetTasksFilterDto): Task[] {
    let tasks = this.getAllTasks();

    if (filterDto.status) {
      tasks = tasks.filter((task) => task.status === filterDto.status);
    }

    if (filterDto.search) {
      tasks = tasks.filter((task) => task.title.includes(filterDto.search));
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);

    if (!found) {
      throw new NotFoundException(`Task ID ${id} not found`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto): Task {
    const { status } = updateTaskStatusDto;

    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
