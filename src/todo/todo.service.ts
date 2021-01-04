import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoEntity } from './todo.entity';
import { ReminderEntity } from './reminder.entity';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ReminderData, TodoRO, TodosRO } from './dto/TodoRO';
import { CreatedTodoDto } from './dto/CreatedTodoDto';
import { ToDoStatus } from './enum/todo.status';
import { ReminderStatus } from '../reminder/enum/reminder.status';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
    @InjectRepository(ReminderEntity)
    private readonly reminderRepository: Repository<ReminderEntity>,
  ) {}

  async update(id: number, todoData: any): Promise<TodoRO> {
    const toUpdate = await this.todoRepository.findOne({ id: id });
    const updated = Object.assign(toUpdate, todoData);
    const todo = await this.todoRepository.save(updated);
    return { todo };
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.todoRepository.delete({ id: id });
  }

  async findOne(id: { id: any }): Promise<TodoRO> {
    const todo = await this.todoRepository.findOne(id);
    return { todo };
  }

  async create(todoData: CreatedTodoDto): Promise<TodoEntity> {
    const todo = new TodoEntity();
    todo.work = todoData.work;
    todo.status = ToDoStatus.Waiting;
    todo.reminders = [];

    const newTodo = await this.todoRepository.save(todo);

    const user = await this.userRepository.findOne({
      where: { id: todoData.user },
      relations: ['todos'],
    });
    user.todos.push(todo);

    await this.userRepository.save(user);

    return newTodo;
  }

  async createReminder(
    todoId: number,
    reminderData: ReminderData,
  ): Promise<ReminderEntity> {
    const reminder = new ReminderEntity();
    reminder.remindingDate = reminderData.remindingDate;
    reminder.reminderStatus = ReminderStatus.Waiting;

    const newReminder = await this.reminderRepository.save(reminder);

    const todo = await this.todoRepository.findOne({
      where: { id: todoId },
      relations: ['reminders'],
    });
    todo.reminders.push(reminder);

    await this.todoRepository.save(reminder);

    return reminder;
  }

  async findAll(): Promise<TodosRO> {
    const qb = await getRepository(TodoEntity)
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.reminders', 'user');

    const todoCount = await qb.getCount();

    const todos = await qb.getMany();

    return { todos, todoCount };
  }
}
