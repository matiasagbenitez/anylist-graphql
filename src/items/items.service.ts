import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) { }

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const item = this.itemsRepository.create(createItemInput);
    return await this.itemsRepository.save(item);
  }

  async findAll(): Promise<Item[]> {
    return await this.itemsRepository.find();
  }

  async findOne(id: number): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ id });
    if (!item) throw new NotFoundException(`Item #${id} not found`);
    return item;
  }

  async update(id: number, updateItemInput: UpdateItemInput): Promise<Item> {
    const item = await this.itemsRepository.preload(updateItemInput);
    if (!item) throw new NotFoundException(`Item #${id} not found`);
    return await this.itemsRepository.save(item);
  }

  async remove(id: number): Promise<Item> {
    const item = await this.findOne(id);
    if (!item) throw new NotFoundException(`Item #${id} not found`);
    await this.itemsRepository.delete(id);
    return item;
  }
}
