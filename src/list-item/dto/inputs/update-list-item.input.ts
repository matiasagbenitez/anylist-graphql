import { IsNumber } from 'class-validator';
import { CreateListItemInput } from './create-list-item.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateListItemInput extends PartialType(CreateListItemInput) {
  @Field(() => Int)
  @IsNumber()
  id: number;
}
