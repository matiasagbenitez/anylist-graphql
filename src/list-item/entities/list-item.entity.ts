import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'list_items' })
@Unique('listItem-item', ['list', 'item'])
@ObjectType()
export class ListItem {

  @PrimaryGeneratedColumn('increment')
  @Field(() => ID)
  id: number;

  @Column()
  @Field(() => Number)
  quantity: number;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  completed: boolean;

  @ManyToOne(() => List, (list) => list.listItem, { nullable: false, lazy: true })
  @Index('listId-itemId-index')
  @Field(() => List)
  list: List;

  @ManyToOne(() => Item, (item) => item.listItem, { nullable: false, lazy: true })
  @Index('itemId-listId-index')
  @Field(() => Item)
  item: Item;

}
