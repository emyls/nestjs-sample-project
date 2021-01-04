import { HttpException, Injectable } from '@nestjs/common';
import { UserData, UserRO, UsersData } from './UserData';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { getRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { LoginUserDto } from './dto/LoginUserDto';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { SECRET } from '../config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findById(id: number): Promise<UserRO> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      const errors = { User: ' not found' };
      throw new HttpException({ errors }, 401);
    }

    return this.buildUserData(user);
  }

  async create(dto: CreateUserDto): Promise<UserRO> {
    const { username, email, password } = dto;

    const newUser = new UserEntity();
    newUser.email = email;
    newUser.username = username;
    newUser.password = password;
    newUser.todos = [];

    const savedUser = await this.userRepository.save(newUser);
    return this.buildUserData(savedUser);
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    const toUpdate = await this.userRepository.findOne(id);
    delete toUpdate.password;
    delete toUpdate.email;
    delete toUpdate.username;

    const updated = Object.assign(toUpdate, dto);
    return await this.userRepository.save(updated);
  }

  async findOne({ email, password }: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      return null;
    }
    console.log(password);
    console.log(user.password);

    if (await argon2.verify(user.password, password)) {
      return user;
    }

    return null;
  }

  public generateJWT(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        exp: exp.getTime() / 1000,
      },
      SECRET,
    );
  }

  private buildUserData(user: UserEntity) {
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      token: this.generateJWT(user),
    };

    return { user: userData };
  }
}
