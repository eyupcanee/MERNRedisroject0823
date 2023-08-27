import redis from "redis";
import dotenv from "dotenv";

//dotenv configration
dotenv.config({ path: "./.env.development.local" });

const redisConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

const redisClient = redis.createClient(redisConfig);

export default redisClient;
