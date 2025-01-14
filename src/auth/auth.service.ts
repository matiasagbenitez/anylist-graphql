import { Injectable } from '@nestjs/common';
import { RegisterInput, LoginInput } from './dto';
import { AuthReponse } from './types/auth-response.type';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

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

    async login(loginInput: LoginInput): Promise<AuthReponse> {

        const { email, password } = loginInput;

        const user = await this.usersService.findOneByEmail(email);

        // Comprobamos la contraseña
        if (!bcrypt.compareSync(password, user.password)) {
            throw new Error('Invalid credentials');
        }

        return {
            token: 'token123',
            user
        };
    }

    revalidate() {
        return 'revalidate';
    }

}
