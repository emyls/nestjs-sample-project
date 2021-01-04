import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ToDoStatus } from './enum/todo.status';
import { ReminderEntity } from './reminder.entity';
import { UserEntity } from '../user/user.entity';

@Entity('todo')
export class TodoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  work: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdOn: Date;

  @Column('int')
  status: ToDoStatus;

  @OneToMany((type) => ReminderEntity, (reminder) => reminder.todo, {
    eager: true,
  })
  @JoinColumn()
  reminders: ReminderEntity[];

  @ManyToOne((type) => UserEntity, (user) => user.todos)
  user: UserEntity;
}
