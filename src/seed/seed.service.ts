import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';
import { Item } from '../items/entities/item.entity';

import { SEED_USERS, SEED_LISTS, SEED_ITEMS } from './data/seed-data';

import { UsersService } from '../users/users.service';
import { ListItemService } from '../list-item/list-item.service';
import { ListsService } from '../lists/lists.service';
import { ItemsService } from '../items/items.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userService: UsersService,

        @InjectRepository(ListItem)
        private readonly listItemRepository: Repository<ListItem>,
        private readonly listItemsService: ListItemService,

        @InjectRepository(List)
        private readonly listRepository: Repository<List>,
        private readonly listsService: ListsService,

        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        private readonly itemsService: ItemsService,
    ) {
        this.isProd = this.configService.get('STATE') === 'prod';
    }

    async seed(): Promise<boolean> {
        if (this.isProd) throw new UnauthorizedException('You are not allowed to seed data in production');

        // Limpiar la base de datos
        await this.listItemRepository.delete({});
        await this.listRepository.delete({});
        await this.itemRepository.delete({});
        await this.userRepository.delete({});

        // Crear usuarios
        const users = [];
        for (const user of SEED_USERS) {
            users.push(await this.userService.create(user));
        }
        const ids = users.map((user) => user.id);

        // Crear items
        const promises = [];
        for (const item of SEED_ITEMS) {
            promises.push(this.itemsService.create(item, ids[Math.floor(Math.random() * ids.length)]));
        }
        await Promise.all(promises);

        // Crear listas
        for (const list of SEED_LISTS) {
            await this.listsService.create(list, ids[Math.floor(Math.random() * ids.length)]);
        }

        // Crear list items
        const lists = await this.listRepository.find();
        const items = await this.itemRepository.find();
        for (const list of lists) {
            for (let i = 0; i < Math.floor(Math.random() * items.length); i++) {
                await this.listItemsService.create({
                    listId: list.id,
                    itemId: items[i].id,
                    quantity: Math.floor(Math.random() * 10),
                    completed: Math.random() > 0.5,
                });
            }
        }

        return true;
    }
}
