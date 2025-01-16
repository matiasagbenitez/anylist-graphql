import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { Item } from './entities/item.entity';
import { User } from '../users/entities/user.entity';

import { PaginationArgs, SearchArgs } from '../common/dto';
import { CreateItemInput, UpdateItemInput } from './dto';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) { }

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const item = this.itemsRepository.create({ ...createItemInput, user });
    return await this.itemsRepository.save(item);
  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<Item[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    if (user) {
      const queryBuilder = this.itemsRepository.createQueryBuilder('item')
        .where('item.userId = :userId', { userId: user.id })
        .take(limit)
        .skip(offset);
      if (search) queryBuilder.andWhere('LOWER(item.name) LIKE LOWER(:search)', { search: `%${search}%` });
      return await queryBuilder.getMany();
    }

    // if (user) return await this.itemsRepository.find({
    //   where: {
    //     user: { id: user.id },
    //     name: Like(`%${search}%`)
    //   },
    //   take: limit,
    //   skip: offset
    // });

    return await this.itemsRepository.find({
      where: { name: Like(`%${search}%`) },
      take: limit,
      skip: offset
    });
  }

  async findOne(id: number, user: User): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ id, user });
    if (!item) throw new NotFoundException(`Item #${id} not found`);
    return item;
  }

  async update(id: number, updateItemInput: UpdateItemInput, user: User): Promise<Item> {
    await this.findOne(id, user);
    const item = await this.itemsRepository.preload(updateItemInput);
    if (!item) throw new NotFoundException(`Item #${id} not found`);
    return await this.itemsRepository.save(item);
  }

  async remove(id: number, user: User): Promise<Item> {
    const item = await this.findOne(id, user);
    if (!item) throw new NotFoundException(`Item #${id} not found`);
    await this.itemsRepository.delete(id);
    return item;
  }

  async countByUser(user: User): Promise<number> {
    return await this.itemsRepository.count({
      where: { user: { id: user.id } },
    });
  }
}
