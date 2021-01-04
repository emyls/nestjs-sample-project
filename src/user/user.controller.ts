import { Controller, Get, Post, Put, Delete, Body, Param, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserData, UserRO, UsersData } from './UserData';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { LoginUserDto } from './dto/LoginUserDto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  async create(@Body('user') userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Put('users/:id')
  async update(
    @Param('id') userId: number,
    @Body('user') userData: UpdateUserDto,
  ) {
    return await this.userService.update(userId, userData);
  }

  @Post('users/login')
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserRO> {
    const _user = await this.userService.findOne(loginUserDto);

    const errors = { User: ' not found' };
    if (!_user) throw new HttpException({ errors }, 401);

    const token = await this.userService.generateJWT(_user);
    const { id, email, username } = _user;
    const user = { id, email, token, username };
    return { user };
  }
}
