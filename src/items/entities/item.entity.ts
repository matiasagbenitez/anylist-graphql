import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {

  @PrimaryGeneratedColumn('increment')
  @Field(() => ID)
  id: number;

  @Column()
  @Field(() => String) 
  name: string;

  // @Column()
  // @Field(() => Float)
  // quantity: number;
 
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  unit?: string;

  @Column()
  @Field(() => String)
  category: string;

  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('userId-item-index')
  @Field(() => User)
  user: User;
}
