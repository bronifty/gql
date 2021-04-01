import { MiddlewareFn } from "type-graphql";
import { Context } from "../types/context-type";

export const IsAuth: MiddlewareFn<Context> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("signup / login to perform this operation");
  }
  return next();
};
