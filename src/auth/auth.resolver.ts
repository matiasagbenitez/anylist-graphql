import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput, LoginInput } from './dto';
import { AuthReponse } from './types/auth-response.type';

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

  @Query(() => String, { name: 'revalidate' })
  revalidate() {
  }

}
