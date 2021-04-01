import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "./post";
import { Vote } from "./vote";

@ObjectType()
@Entity({ name: "user" })
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany((type) => Post, (post) => post.creator)
  posts!: Post[];

  @OneToMany((type) => Vote, (vote) => vote.voter)
  votes!: Vote[];

  @Field()
  @CreateDateColumn()
  createdAt!: Date;
}
