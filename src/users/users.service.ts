import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RegisterInput } from '../auth/dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  private logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(registerInput: RegisterInput): Promise<User> {
    try {
      const user = this.userRepository.create({
        ...registerInput,
        password: await bcrypt.hash(registerInput.password, 10),
      });
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  findOne(id: number): Promise<User> {
    throw new Error('Method not implemented.');
  }

  block(id: number): Promise<User> {
    throw new Error('Method not implemented.');
  }



  private handleDBError(error: any): never {
    if (error.code === '23505') throw new BadRequestException('User already exists');
    this.logger.error(error.message);
    throw new InternalServerErrorException('Internal server error');
  }
}
