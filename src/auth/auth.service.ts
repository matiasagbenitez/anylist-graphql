import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterInput, LoginInput } from './dto';
import { AuthReponse } from './types/auth-response.type';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async register(registerInput: RegisterInput): Promise<AuthReponse> {
        const user = await this.usersService.create(registerInput);
        const token = this.jwtService.sign({ id: user.id });
        return { token, user };
    }

    async login(loginInput: LoginInput): Promise<AuthReponse> {
        const { email, password } = loginInput;
        const user = await this.usersService.findOneByEmail(email);
        if (!bcrypt.compareSync(password, user.password)) throw new Error('Invalid credentials');
        const token = this.jwtService.sign({ id: user.id });
        return { token, user };
    }

    async validateUserById(id: number): Promise<User> {
        const user = await this.usersService.findOneById(id);
        if (!user.isActive) throw new UnauthorizedException('User is blocked');
        delete user.password;
        return user;
    }

    revalidateToken(user: User): AuthReponse {
        const token = this.jwtService.sign({ id: user.id });
        return { token, user };
    }
}


