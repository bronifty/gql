import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Vote } from "./vote";
import { User } from "./user";

@ObjectType()
@Entity({ name: "post" })
export class Post {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  description!: string;

  @Column()
  creatorId!: number;
  @ManyToOne((type) => User, (user) => user.posts)
  creator!: User;

  @OneToMany((type) => Vote, (vote) => vote.post)
  votes!: Vote[];

  @Field(() => Number)
  upvotes!: Number;

  @Field(() => Number)
  downvotes!: Number;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;
}
