import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  @Field(() => String)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Field(() => String)
  password: string;

}
