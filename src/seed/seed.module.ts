import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ItemsModule } from '../items/items.module';
import { UsersModule } from '../users/users.module';

import { SeedResolver } from './seed.resolver';
import { SeedService } from './seed.service';
import { ListsModule } from '../lists/lists.module';
import { ListItemModule } from '../list-item/list-item.module';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [
    ConfigModule,
    UsersModule,
    ListItemModule,
    ListsModule,
    ItemsModule,
  ],
})
export class SeedModule { }
