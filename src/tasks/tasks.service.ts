import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateTaskDto,
  GetTasksFilterDto,
  UpdateTaskStatusDto,
} from './dto/tasks.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.getTaskById(id);

    if (!found) {
      throw new NotFoundException(`Task ID ${id} not found`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.deleteTask(id);

    if (result === 0) {
      throw new NotFoundException(`Task ID ${id} not found`);
    }

    return;
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;

    const task = await this.taskRepository.updateTaskStatus(id, status);

    if (!task) {
      throw new NotFoundException(`Task ID ${id} not found`);
    }

    return task;
  }
}
