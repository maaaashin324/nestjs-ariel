import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto, GetTasksFilterDto } from './dto/tasks.dto';
import { TaskStatus } from './task-status.enum';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ITaskRepository } from './tasks.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TaskRepository implements ITaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }

  async getTaskById(id: string): Promise<Task | null> {
    const found = await this.taskRepository.findOne({
      where: { id },
    });

    if (!found) {
      return null;
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    try {
      await this.taskRepository.save(task);

      return task;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteTask(id: string): Promise<number> {
    const result = await this.taskRepository.delete(id);

    return result.affected ?? 0;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task | null> {
    const task = await this.getTaskById(id);

    if (!task) {
      return null;
    }

    task.status = status;

    await this.taskRepository.update(id, task);

    return task;
  }
}
