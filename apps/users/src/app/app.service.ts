import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  getData(): { message: string } {
    return { message: 'Welcome to users!' };
  }

  getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
