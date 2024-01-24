
const redisClient = require("ioredis").createClient({
    url: process.env.REDIS_URL,
  });

module.exports = redisClient;