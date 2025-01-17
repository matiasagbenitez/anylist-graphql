import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './entities/user.entity';
import { ItemsModule } from '../items/items.module';
import { ListsModule } from 'src/lists/lists.module';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [TypeOrmModule.forFeature([User]), ItemsModule, ListsModule],
  exports: [

    // En caso de que se necesite utilizar la entidad o inyectar el repositorio
    TypeOrmModule,

    // En caso de que se necesite utilizar el servicio
    UsersService
  ]
})
export class UsersModule { }
