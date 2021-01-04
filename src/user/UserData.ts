import { UserEntity } from './user.entity';

export interface UserData {
  id: number;
  username: string;
  email: string;
}

export interface UserRO {
  user: UserData;
}

export interface UsersData {
  users: UserEntity[];
  usersCount: number;
}
