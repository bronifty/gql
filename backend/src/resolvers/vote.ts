import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Vote } from "../entities/vote";
import { IsAuth } from "../middleware/isAuth";
import { Context } from "../types/context-type";

@InputType()
class VoteInput {
  @Field(() => Number)
  voteStatus!: number;
  @Field()
  postId!: number;
}

@Resolver(Vote)
export class VoteResolver {
  @Mutation(() => Vote)
  @UseMiddleware(IsAuth)
  async vote(@Arg("data") data: VoteInput, @Ctx() ctx: Context) {
    const allowedValues = [-1, 0, 1];
    if (!allowedValues.includes(data.voteStatus))
      throw new Error("invalid vote status");
    const [
      [deletedVote],
    ] = await ctx.pg.query(
      `delete from vote where "voterId" = $1 and "postId" = $2 returning *`,
      [ctx.req.session.userId, data.postId]
    );
    if (data.voteStatus === 0) return deletedVote;
    const [
      vote,
    ] = await ctx.pg.query(
      `insert into vote ("voterId", "postId", "voteStatus") values ($1, $2, $3) returning *`,
      [ctx.req.session.userId, data.postId, data.voteStatus]
    );
    return vote;
  }
}
