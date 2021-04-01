import { Request, Response } from "express";
import { Connection } from "typeorm";
import { createPostCreatorLoader } from "../data-loaders/post-creator-loader";

export interface Context {
  pg: Connection;
  req: Request;
  res: Response;
  postCreatorLoader: ReturnType<typeof createPostCreatorLoader>;
}
