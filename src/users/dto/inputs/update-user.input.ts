import { InputType, Field, PartialType, Int } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
  @IsNumber()
  id: number;

  // Campos que vienen de CreateUserInput

  @Field(() => [ValidRoles], { nullable: true })
  @IsArray()
  @IsOptional()
  roles?: ValidRoles[];

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
