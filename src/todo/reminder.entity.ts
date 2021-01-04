import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReminderStatus } from '../reminder/enum/reminder.status';
import { TodoEntity } from './todo.entity';

@Entity('reminder')
export class ReminderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  remindingDate: Date;

  @Column('int')
  reminderStatus: ReminderStatus;

  @ManyToOne((type) => TodoEntity, (todo) => todo.reminders)
  todo: TodoEntity;
}
