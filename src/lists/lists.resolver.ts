import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';

import { ListsService } from './lists.service';
import { ListItemService } from 'src/list-item/list-item.service';

import { List } from './entities/list.entity';
import { User } from '../users/entities/user.entity';

import { CreateListInput, UpdateListInput } from './dto';
import { PaginationArgs, SearchArgs } from '../common/dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ListItem } from 'src/list-item/entities/list-item.entity';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listItemsService: ListItemService
  ) { }

  @Mutation(() => List, { name: 'createList' })
  async createItem(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() user: User
  ): Promise<List> {
    return await this.listsService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<List[]> {
    return await this.listsService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => List, { name: 'list' })
  async findOne(
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser() user: User
  ): Promise<List> {
    return await this.listsService.findOne(id, user);
  }

  @Mutation(() => List, { name: 'updateList' })
  async updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user: User
  ): Promise<List> {
    const { id } = updateListInput;
    return await this.listsService.update(id, updateListInput, user);
  }

  @Mutation(() => List, { name: 'removeList' })
  async removeItem(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User
  ): Promise<List> {
    return await this.listsService.remove(id, user);
  }

  @ResolveField(() => [ListItem], { name: 'items' })
  async getListItems(
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<ListItem[]> {
    return this.listItemsService.findAll(list, paginationArgs, searchArgs);
  }

  @ResolveField(() => Number, { name: 'totalItems' })
  async totalItems(
    @Parent() list: List
  ): Promise<number> {
    return this.listItemsService.totalItems(list);
  }
}
