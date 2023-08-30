import ioredis from "ioredis";
import dotenv from "dotenv";

//dotenv configration
dotenv.config({ path: "../.env.development.local" });

const redisClient = ioredis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redisClient.on("error", (error) => {
  console.error("Redis bağlantı hatası:", error);
  redisClient.end();
});

export default redisClient;
