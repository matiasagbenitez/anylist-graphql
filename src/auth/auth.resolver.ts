import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto';
import { AuthReponse } from './types/auth-response.type';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => AuthReponse, { name: 'register' })
  async register(@Args('registerInput') registerInput: RegisterInput): Promise<AuthReponse> {
    return await this.authService.register(registerInput);
  }

  @Mutation(() => String, { name: 'login' })
  login() {
  }

  @Query(() => String, { name: 'revalidate' })
  revalidate() {
  }

}
