import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Post } from "../entities/post";
import { User } from "../entities/user";
import { IsAuth } from "../middleware/isAuth";
import { Context } from "../types/context-type";
import { validatePost } from "../utils/validate";

@InputType()
export class PostInput {
  @Field()
  title!: string;
  @Field()
  description!: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts!: Post[];
  @Field(() => Boolean)
  hasMore!: boolean;
}

@ObjectType()
class VotedStatusPost {
  @Field(() => Post)
  post!: Post;
  @Field(() => Number, { nullable: true })
  voteStatus!: number;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => User)
  async creator(@Root() root: Post, @Ctx() ctx: Context) {
    const loadedUser = await ctx.postCreatorLoader.load(root.creatorId);
    return loadedUser;
  }

  @FieldResolver(() => Number)
  async upvotes(@Root() root: Post, @Ctx() ctx: Context) {
    const [{ count }] = await ctx.pg.query(
      `
		select count(*) from vote
		where "postId" = $1 and "voteStatus" = 1
	  `,
      [root.id]
    );
    return count;
  }

  @FieldResolver(() => Number)
  async downvotes(@Root() root: Post, @Ctx() ctx: Context) {
    const [{ count }] = await ctx.pg.query(
      `
		select count(*) from vote
		where "postId" = $1 and "voteStatus" = -1
	  `,
      [root.id]
    );
    return count;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Ctx() ctx: Context,
    @Arg("offset", () => Number, { nullable: true }) offset: number | null,
    @Arg("limit") limit: number
  ) {
    const restrictedLimit = Math.min(limit, 5);
    let posts = [];
    if (offset) {
      posts = await ctx.pg.query(
        `
	  	select * from post
		where "id" < $1
		order by "createdAt" desc
		limit $2
		`,
        [offset, restrictedLimit + 1]
      );
    } else {
      posts = await ctx.pg.query(
        `
		select * from post
		order by "createdAt" desc
		limit $1
		`,
        [restrictedLimit + 1]
      );
    }
    return {
      posts: posts.slice(0, restrictedLimit),
      hasMore: posts.length === restrictedLimit + 1,
    };
  }

  @Query(() => VotedStatusPost)
  async post(@Arg("id") id: number, @Ctx() ctx: Context) {
    const [post] = await ctx.pg.query("select * from post where id = $1", [id]);
    if (!post) throw new Error(`couldnt fetch post with id ${id}`);
    let voteStatus = null;
    if (ctx.req.session.userId) {
      const [
        res,
      ] = await ctx.pg.query(
        `select "voteStatus" from vote where "postId" = $1 and "voterId" = $2`,
        [id, ctx.req.session.userId]
      );
      if (res) voteStatus = res.voteStatus;
    }
    return { post, voteStatus };
  }

  @Mutation(() => Post)
  @UseMiddleware(IsAuth)
  async createPost(@Arg("data") data: PostInput, @Ctx() ctx: Context) {
    validatePost(data);
    const [
      post,
    ] = await ctx.pg.query(
      `insert into post (title, description, "creatorId") values ($1, $2, $3) returning *`,
      [data.title, data.description, ctx.req.session.userId]
    );
    return post;
  }

  @Mutation(() => Post)
  @UseMiddleware(IsAuth)
  async updatePost(
    @Arg("id") id: number,
    @Arg("data") data: PostInput,
    @Ctx() ctx: Context
  ) {
    validatePost(data);
    const [
      [post],
    ] = await ctx.pg.query(
      `update post set title = $1, description = $2 where id = $3 and "creatorId" = $4 returning *`,
      [data.title, data.description, id, ctx.req.session.userId]
    );
    if (!post) throw new Error("couldn't update post");
    return post;
  }

  @Mutation(() => Post)
  @UseMiddleware(IsAuth)
  async deletePost(@Arg("id") id: number, @Ctx() ctx: Context) {
    const [
      [post],
    ] = await ctx.pg.query(
      `delete from post where id = $1 and "creatorId" = $2 returning *`,
      [id, ctx.req.session.userId]
    );
    if (!post) throw new Error("couldn't delete post");
    return post;
  }
}
