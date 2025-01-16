import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput, ValidRolesArgs } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { ItemsService } from '../items/items.service';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {

  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
  ) { }

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.SUPERUSER]) user: User,
  ): Promise<User[]> {
    const { roles } = validRoles;
    return this.usersService.findAll(roles);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser([ValidRoles.SUPERUSER]) user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.SUPERUSER]) user: User,
  ): Promise<User> {
    const { id } = updateUserInput;
    return this.usersService.update(id, updateUserInput, user);
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser([ValidRoles.SUPERUSER]) user: User,
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField(() => Int, { name: 'itemsCount' })
  async itemsCount(
    @CurrentUser([ValidRoles.SUPERUSER]) superUser: User,
    @Parent() user: User,
  ): Promise<number> {
    return this.itemsService.countByUser(user);
  }
}
