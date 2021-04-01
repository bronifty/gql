console.clear();

import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import "reflect-metadata";
import { getApolloServer } from "./apollo-server-config";
import { getDbConnection } from "./db-config";
import { redisSession } from "./redis-config";

declare module "express-session" {
  interface Session {
    userId: number | null;
  }
}

const app = express();

const main = async () => {
  const dbConnection = await getDbConnection();
  const apolloServer = await getApolloServer(dbConnection);
  app.use(redisSession);
  app.use(
    cors({
      origin: "frontend",
      credentials: true,
    })
  );
  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(process.env.PORT);
};

main()
  .then(() => console.log("server up and running"))
  .catch((e) => console.log(e));
