import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Connection } from "typeorm";
import { createPostCreatorLoader } from "./data-loaders/post-creator-loader";
import { InfoResolver } from "./resolvers/info";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { VoteResolver } from "./resolvers/vote";
import { Context } from "./types/context-type";

export const getApolloServer = async (dbConnection: Connection) => {
  const schema = await buildSchema({
    resolvers: [InfoResolver, PostResolver, UserResolver, VoteResolver],
    validate: false,
  });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }): Context => ({
      pg: dbConnection,
      req,
      res,
      postCreatorLoader: createPostCreatorLoader(),
    }),
  });
  return apolloServer;
};
