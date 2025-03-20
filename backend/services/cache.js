import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, {
  connectTimeout: 10000, // Ensuring a timeout, in case connection issues
  maxRetriesPerRequest: 3, // Limiting  retry attempts to prevent infinite retries
});

export const getOrSetCache = async (key, fetchData, ttl = 3600) => {
  try {
    const cachedData = await redis.get(key);
    if (cachedData) return JSON.parse(cachedData);

    const freshData = await fetchData();

    if (freshData) {
      await redis.setex(key, ttl, JSON.stringify(freshData));
    }

    return freshData;
  } catch (error) {
    console.error("Redis Cache Error:", error); // Logging errors for debugging
    return fetchData(); // Fallback to database query if Redis fails
  }
};
