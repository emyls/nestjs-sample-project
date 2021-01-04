import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { Connection } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
