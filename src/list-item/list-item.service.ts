import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListItemInput, UpdateListItemInput } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { Like, Repository } from 'typeorm';
import { List } from 'src/lists/entities/list.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto';

@Injectable()
export class ListItemService {

  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>
  ) { }

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;
    const listItem = this.listItemRepository.create({
      item: { id: itemId },
      list: { id: listId },
      ...rest
    });
    await this.listItemRepository.save(listItem);
    return this.findOne(listItem.id);
  }

  async findAll(
    list: List,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs
  ): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listItemRepository.createQueryBuilder('list_items')
      .innerJoin('list_items.item', 'item')
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, { listId: list.id });

    if (search) {
      queryBuilder.andWhere('item.name LIKE :search', { search: `%${search}%` });
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: number): Promise<ListItem> {
    const listItem = await this.listItemRepository.findOneBy({ id });
    if (!listItem) throw new NotFoundException(`List item with id ${id} not found`);
    return listItem;
  }

  async update(id: number, updateListItemInput: UpdateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = updateListItemInput;

    // ! No actualiza el item ni la lista
    // const listItem = await this.listItemRepository.preload({
    //   ...rest,
    //   item: { id: itemId },
    //   list: { id: listId },
    // });
    // if (!listItem) throw new NotFoundException(`List item with id ${id} not found`);
    // return await this.listItemRepository.save(listItem);

    // ! Como se hizo en el curso
    // const queryBuilder = this.listItemRepository.createQueryBuilder()
    //   .update()
    //   .set(rest) 
    //   .where('id = :id', { id });

    // if (listId) queryBuilder.set({ list: { id: listId } });
    // if (itemId) queryBuilder.set({ item: { id: itemId } });
    // await queryBuilder.execute();

    const updateObject = { ...rest };
    if (listId) updateObject['list'] = { id: listId };
    if (itemId) updateObject['item'] = { id: itemId };

    const queryBuilder = this.listItemRepository.createQueryBuilder()
      .update()
      .set(updateObject)
      .where('id = :id', { id });

    await queryBuilder.execute();

    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }

  async totalItems(list: List): Promise<number> {
    return await this.listItemRepository.count({ where: { list } });
  }
}
