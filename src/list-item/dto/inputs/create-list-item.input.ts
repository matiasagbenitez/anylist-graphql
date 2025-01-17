import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity: number = 1;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  completed: boolean = false;

  @Field(() => Int)
  @IsNumber()
  listId: number;

  @Field(() => Int)
  @IsNumber()
  itemId: number;

}
