import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto, GetTasksFilterDto } from './dto/tasks.dto';
import { TaskStatus } from './task-status.enum';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }

  async getTaskById(id: string): Promise<Task | null> {
    const found = await this.findOne({
      where: { id },
    });

    if (!found) {
      return null;
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    try {
      await this.save(task);

      return task;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteTask(id: string): Promise<number> {
    const result = await this.delete(id);

    return result.affected ?? 0;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task | null> {
    const task = await this.getTaskById(id);

    if (!task) {
      return null;
    }

    task.status = status;

    await this.update(id, task);

    return task;
  }
}
