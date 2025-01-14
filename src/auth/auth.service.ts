import { Injectable } from '@nestjs/common';
import { RegisterInput } from './dto';
import { AuthReponse } from './types/auth-response.type';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService
    ) { }

    async register(registerInput: RegisterInput): Promise<AuthReponse> {

        // Creamos el usuario
        const user = await this.usersService.create(registerInput);

        // Creamos el token
        const token = 'token123';

        return {
            token,
            user
        };
    }

    login() {
        return 'login';
    }
}
