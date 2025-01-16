import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { SEED_USERS, SEED_ITEMS } from './data/seed-data';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userService: UsersService,

        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        private readonly itemsService: ItemsService,
    ) {
        this.isProd = this.configService.get('STATE') === 'prod';
    }

    async seed(): Promise<boolean> {
        if (this.isProd) throw new UnauthorizedException('You are not allowed to seed data in production');

        // Limpiar la base de datos
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

        return true;
    }
}
