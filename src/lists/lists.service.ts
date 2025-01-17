import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { List } from './entities/list.entity';
import { User } from '../users/entities/user.entity';

import { CreateListInput, UpdateListInput } from './dto';
import { PaginationArgs, SearchArgs } from 'src/common/dto';

@Injectable()
export class ListsService {

  constructor(
    @InjectRepository(List)
    private readonly listsRepository: Repository<List>,
  ) { }

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const list = this.listsRepository.create({ ...createListInput, user });
    return await this.listsRepository.save(list);
  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<List[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    if (user) {
      const queryBuilder = this.listsRepository.createQueryBuilder('list')
        .where('list.userId = :userId', { userId: user.id })
        .take(limit)
        .skip(offset);
      if (search) queryBuilder.andWhere('LOWER(list.name) LIKE LOWER(:search)', { search: `%${search}%` });
      return await queryBuilder.getMany();
    }

    return await this.listsRepository.find({
      where: { name: Like(`%${search}%`) },
      take: limit,
      skip: offset
    });
  }

  async findOne(id: number, user: User): Promise<List> {
    const list = await this.listsRepository.findOneBy({ id, user });
    if (!list) throw new NotFoundException(`List #${id} not found`);
    return list;
  }

  async update(id: number, updateListInput: UpdateListInput, user: User): Promise<List> {
    await this.findOne(id, user);
    const list = await this.listsRepository.preload(updateListInput);
    if (!list) throw new NotFoundException(`List #${id} not found`);
    return await this.listsRepository.save(list);
  }

  async remove(id: number, user: User): Promise<List> {
    const list = await this.findOne(id, user);
    if (!list) throw new NotFoundException(`List #${id} not found`);
    await this.listsRepository.delete(id);
    return list;
  }

  async listsCountByUser(user: User): Promise<number> {
    return await this.listsRepository.count({
      where: { user: { id: user.id } },
    });
  }
}
