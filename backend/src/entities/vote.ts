import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Post } from "./post";
import { User } from "./user";

@ObjectType()
@Entity({ name: "vote" })
export class Vote {
  @Field()
  @Column()
  voteStatus!: number;

  @PrimaryColumn()
  voterId!: number;
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.votes)
  voter!: User;

  @PrimaryColumn()
  postId!: number;
  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.votes, { onDelete: "CASCADE" })
  post!: Post;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;
}
