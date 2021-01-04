import { Controller, Get, Post, Put, Delete, Body, Param, HttpException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { ReminderData, TodoRO, TodosRO } from './dto/TodoRO';
import { CreatedTodoDto } from './dto/CreatedTodoDto';
import { User } from '../user/user.decorator';

@Controller()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('todos')
  async findAll(@User('id') userId: number): Promise<TodosRO> {
    return await this.todoService.findAll();
  }

  @Post('todos')
  async create(@Body('todo') todoData: CreatedTodoDto) {
    return this.todoService.create(todoData);
  }

  @Post('todos/:id/reminders')
  async createReminder(
    @Param() params,
    @Body('reminder') reminderData: ReminderData,
  ) {
    return this.todoService.createReminder(params.id, reminderData);
  }

  @Put('todos/:id')
  async update(@Param() params, @Body('todo') todoData: CreatedTodoDto) {
    return this.todoService.update(params.id, todoData);
  }

  @Delete('todos/:id')
  async delete(@Param() params) {
    return this.todoService.delete(params.id);
  }

  @Get('todos/:id')
  async findOne(@Param('id') id): Promise<TodoRO> {
    return await this.todoService.findOne({ id });
  }
}
