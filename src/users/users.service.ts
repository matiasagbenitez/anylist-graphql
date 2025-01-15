import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, createParamDecorator } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RegisterInput } from '../auth/dto';
import { User } from './entities/user.entity';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto';

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

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0) return await this.userRepository.find();

    return await this.userRepository.createQueryBuilder('user')
      .where('user.roles @> :roles', { roles })
      .getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findOneById(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async block(id: number, blockerUser: User): Promise<User> {
    const user = await this.findOneById(id);
    user.isActive = false;
    user.lastUpdatedBy = blockerUser;
    return await this.userRepository.save(user);
  }

  async update(id: number, updateUserInput: UpdateUserInput, updaterUser: User): Promise<User> {
    const user = await this.userRepository.preload({
      id,
      ...updateUserInput,
      lastUpdatedBy: updaterUser
    });
    return await this.userRepository.save(user);
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') throw new BadRequestException('User already exists');
    this.logger.error(error.message);
    throw new InternalServerErrorException('Internal server error');
  }
}
