import path from "path";
import { Connection, createConnection } from "typeorm";
import { Post } from "./entities/post";
import { User } from "./entities/user";
import { Vote } from "./entities/vote";

export const getDbConnection = async () => {
  let connection: Connection;
  if (process.env.NODE_ENV === "dev") {
    connection = await createConnection({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      synchronize: true,
      migrations: [path.join(__dirname, "./migrations/*")],
      entities: [Post, User, Vote],
    });
  } else {
    connection = await createConnection({
      type: "postgres",
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      migrations: [path.join(__dirname, "./migrations/*")],
      entities: [Post, User, Vote],
    });
  }

  return connection;
};
