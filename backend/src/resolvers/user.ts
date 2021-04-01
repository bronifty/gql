import argon from "argon2";
import jwt from "jsonwebtoken";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entities/user";
import { IsAuth } from "../middleware/isAuth";
import { Context } from "../types/context-type";
import { sendPasswordResetLink } from "../utils/send-password-reset-link";
import { validateUser } from "../utils/validate";

@InputType()
export class UserInput {
  @Field()
  email!: string;
  @Field()
  password!: string;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => Number)
  @UseMiddleware(IsAuth)
  async upvotes(@Ctx() ctx: Context, @Root() root: User) {
    const [{ count }] = await ctx.pg.query(
      `
		select count(*) from vote 
		where "voteStatus" = 1 and 
		"postId" in (
			select id from post
			where "creatorId" = $1
		)
	  `,
      [root.id]
    );
    return count;
  }

  @FieldResolver(() => Number)
  @UseMiddleware(IsAuth)
  async downvotes(@Ctx() ctx: Context, @Root() root: User) {
    const [{ count }] = await ctx.pg.query(
      `
		select count(*) from vote 
		where "voteStatus" = -1 and 
		"postId" in (
			select id from post
			where "creatorId" = $1
		)
	  `,
      [root.id]
    );
    return count;
  }

  @FieldResolver(() => Number)
  @UseMiddleware(IsAuth)
  async posts(@Ctx() ctx: Context, @Root() root: User) {
    const [{ count }] = await ctx.pg.query(
      `
		select count(*) from post 
		where "creatorId" = $1
	  `,
      [root.id]
    );
    return count;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: Context) {
    if (!ctx.req.session || !ctx.req.session.userId) return null;
    const [user] = await ctx.pg.query(`select * from "user" where id = $1`, [
      ctx.req.session.userId,
    ]);
    return user;
  }

  @Mutation(() => String)
  async logout(@Ctx() ctx: Context) {
    if (!ctx.req.session || !ctx.req.session.userId) return "not logged in";
    ctx.res.clearCookie("redis-session-cookie");
    await new Promise((resolve) => ctx.req.session.destroy(resolve));
    return "logged out successfully";
  }

  @Mutation(() => String)
  async getResetPasswordLink(@Arg("email") email: string, @Ctx() ctx: Context) {
    const [user] = await ctx.pg.query(`select * from "user" where email = $1`, [
      email,
    ]);
    if (!user) throw new Error("email doesnt exist, go to signup");
    const token = jwt.sign(
      { userId: user.id },
      process.env.PASSWORD_RESET_SECRET as string,
      { expiresIn: "1d" }
    );
    await sendPasswordResetLink(email, token);
    return "password reset link sent to your email successfully";
  }

  @Mutation(() => String)
  async changePassword(
    @Arg("password") password: string,
    @Arg("token") token: string,
    @Ctx() ctx: Context
  ) {
    if (password.length < 5)
      throw new Error("password should be atleast 5 characters long");
    let payload = null;
    try {
      payload = jwt.verify(token, process.env.PASSWORD_RESET_SECRET as string);
    } catch (e) {
      throw new Error("invalid token, try with a fresh password reset link");
    }
    const hashedPassword = await argon.hash(password);
    const { userId } = payload as any;
    await ctx.pg.query(
      `update "user" set password = $1 where id = $2 returning *`,
      [hashedPassword, userId]
    );
    return "password updated successfully, go to login";
  }

  @Mutation(() => String)
  async signup(@Ctx() ctx: Context, @Arg("data") data: UserInput) {
    validateUser(data);
    const [exists] = await ctx.pg.query(
      `select * from "user" where email = $1`,
      [data.email]
    );
    data.password = await argon.hash(data.password);
    if (exists) throw new Error("email already exists, go to login");
    await ctx.pg.query(
      `insert into "user" (email, password) values ($1, $2) returning *`,
      [data.email, data.password]
    );
    return "signed up successfully, go to login";
  }

  @Mutation(() => User)
  async login(@Ctx() ctx: Context, @Arg("data") data: UserInput) {
    const [user] = await ctx.pg.query(`select * from "user" where email = $1`, [
      data.email,
    ]);
    if (!user) {
      await this.logout(ctx);
      throw new Error("email doesnt exist, go to signup");
    }
    const validPassword = await argon.verify(user.password, data.password);
    if (!validPassword) {
      await this.logout(ctx);
      throw new Error("invalid password, try resetting password");
    }
    ctx.req.session.userId = user.id;
    return user;
  }
}
