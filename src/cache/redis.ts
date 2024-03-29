import Redis from 'ioredis';
import config from 'config';
import { infoLog, warningLog, errorLog } from '@/utils/log';

const redisHost: string = config.get('redisHost');

const REDIS_HOSTS = `${redisHost || '103.104.122.224:6379'}`.split(',');
const CACHE_PREFIX = 'folizon';

class RedisCache {
  private redisClient = null;
  constructor() {
    this.redisClient = this.createConnection();
  }
  public createConnection = () => {
    const redisConnectionOptions = {
      enableReadyCheck: true,
      clusterRetryStrategy: times => {
        const delay = Math.min(100 + times * 2, 2000);
        warningLog(`Redis failed to connect, try again in: ${delay}`);
        return delay;
      },
    };
    if (REDIS_HOSTS.length > 1) {
      const clusterNodes = REDIS_HOSTS.map(
        n => {
          const v = n.split(':');
          return Object.assign(
            {},
            {
              host: v[0],
              port: v[1],
            },
          );
        },
        {
          scaleReads: 'slave',
        },
      );
      warningLog('Connecting to Redis cluster..');
      return new Redis.Cluster(clusterNodes, redisConnectionOptions);
    } else {
      const redisConfig = REDIS_HOSTS[0].split(':');
      warningLog('Connecting to Redis..');
      return new Redis(redisConfig[1], redisConfig[0], redisConnectionOptions);
    }
  };

  public setCache = (cacheKey, value, ttl = 0) => {
    let { key, field } = cacheKey;
    key = `${CACHE_PREFIX}:${key}`;

    if (field) {
      this.redisClient.hset(key, field, JSON.stringify(value));
      this.redisClient.expire(key, ttl);
    } else {
      if (ttl > 0) {
        this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
      } else {
        this.redisClient.set(key, JSON.stringify(value));
      }
    }
  };

  public getCache = async cacheKey => {
    let { key, field } = cacheKey;
    key = `${CACHE_PREFIX}:${key}`;
    let cached;
    if (field) {
      cached = await this.redisClient.hget(key, field);
    } else {
      cached = await this.redisClient.get(key);
    }

    if (!cached || cached === 'updating') return cached;

    try {
      cached = JSON.parse(cached);
    } catch (e) {
      cached = null;
    }
    return cached;
  };

  public delCache = key => {
    this.redisClient.del(`${CACHE_PREFIX}:${key}`);
  };
  public disconnectRedis = () => {
    if (this.redisClient) {
      warningLog('Disconnect to Redis..');
      return Promise.all([this.redisClient.quit()]);
    }
  };
}

const RedisCacheManager = new RedisCache();
export default RedisCacheManager;
