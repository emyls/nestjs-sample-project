import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './todo.entity';
import { ReminderEntity } from './reminder.entity';
import { UserModule } from '../user/user.module';
import { UserEntity } from '../user/user.entity';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodoEntity, ReminderEntity, UserEntity]),
    UserModule,
  ],
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}
// implements NestModule {
  // public configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AuthMiddleware)
  //     .forRoutes(
  //       { path: 'todos', method: RequestMethod.POST },
  //       { path: 'todos/:id', method: RequestMethod.DELETE },
  //       { path: 'todos/:id', method: RequestMethod.PUT },
  //       { path: 'todos/:id/reminders', method: RequestMethod.POST },
  //       { path: 'todos', method: RequestMethod.GET },
  //       { path: 'todos/:id', method: RequestMethod.GET },
  //     );
  // }
// }
