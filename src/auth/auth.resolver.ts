import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput, LoginInput } from './dto';
import { AuthReponse } from './types/auth-response.type';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => AuthReponse, { name: 'register' })
  async register(@Args('registerInput') registerInput: RegisterInput): Promise<AuthReponse> {
    return await this.authService.register(registerInput);
  }

  @Mutation(() => AuthReponse, { name: 'login' })
  async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthReponse> {
    return await this.authService.login(loginInput);
  }

  @Query(() => AuthReponse, { name: 'revalidate' })
  @UseGuards(JwtAuthGuard)
  revalidate(
    // @CurrentUser([ValidRoles.ADMIN]) user: User
    @CurrentUser() user: User
  ): AuthReponse {
    return this.authService.revalidateToken(user);
  }

}
