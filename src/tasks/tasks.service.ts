import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateTaskDto,
  GetTasksFilterDto,
  UpdateTaskStatusDto,
} from './dto/tasks.dto';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

export interface ITaskRepository {
  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]>;
  getTaskById(id: string, user: User): Promise<Task>;
  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>;
  deleteTask(id: string, user: User): Promise<number>;
  updateTaskStatus(id: string, status: string, user: User): Promise<Task>;
}

@Injectable()
export class TasksService {
  constructor(
    @Inject('ITaskRepository') private readonly taskRepository: ITaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.getTaskById(id, user);

    if (!found) {
      throw new NotFoundException(`Task ID ${id} not found`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.taskRepository.deleteTask(id, user);

    if (result === 0) {
      throw new NotFoundException(`Task ID ${id} not found`);
    }

    return;
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;

    const task = await this.taskRepository.updateTaskStatus(id, status, user);

    if (!task) {
      throw new NotFoundException(`Task ID ${id} not found`);
    }

    return task;
  }
}
