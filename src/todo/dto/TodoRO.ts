import { ToDoStatus } from '../enum/todo.status';
import { ReminderStatus } from '../../reminder/enum/reminder.status';
import { TodoEntity } from '../todo.entity';

export interface TodoData {
  id: number;
  work: string;
  createdOn: Date;
  status: ToDoStatus;
  reminders: ReminderRO;
}

export interface TodosRO {
  todos: TodoEntity[];
  todoCount: number;
}

export interface TodoRO {
  todo: TodoEntity;
}

export interface ReminderRO {
  reminders: ReminderData[];
}

export interface ReminderData {
  id: number;
  remindingDate: Date;
  status: ReminderStatus;
}
