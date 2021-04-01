import redis, { RedisClient } from "redis";
import session from "express-session";
import createRedisStore from "connect-redis";

const redisStore = createRedisStore(session);
let redisClient: RedisClient;
if (process.env.NODE_ENV === "dev") {
  redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
  });
} else {
  redisClient = redis.createClient(process.env.REDIS_URL!);
}

export const redisSession = session({
  name: "redis-session-cookie",
  store: new redisStore({
    client: redisClient,
    disableTouch: true,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 5,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  },
  secret: process.env.REDIS_SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
});
