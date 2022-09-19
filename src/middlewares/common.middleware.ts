/* eslint-disable no-unused-vars */
import { validate } from 'jsonschema';
// import { EnumResult } from '@constants/enumCommon';
import { sendApiResponseData } from '@controllers/utils';
import { NextFunction, Request, Response } from 'express';
import { EnumResult } from '@constants/enumCommon';
import RedisCacheManager from '@/cache/redis';
import { errorLog, infoLog, warningLog } from '@/utils/log';

const INTERVAL = 50;
const MAX_WAIT = 5000;
const DEFAULT_CACHE_TIME = (process.env.DEFAULT_CACHE_TIME || 60) as number;

const commonMiddleware = {
  verifyParseParam:
    (instance, method = 'POST', dataFormat = 'JSON') =>
    (req: Request, res: Response, next: NextFunction) => {
      // console.log('verifyParseParam');
      const isVerifyParams = validate(req.body, instance).valid;
      return isVerifyParams ? next() : sendApiResponseData(res, EnumResult.ERROR_PARAMS, { data: null });
    },
  verifyProcessHeader: async (req, res, next) => {
    // console.log('VerifyProcessHeader');
    // let isVerifyHeader = true;
    // if (Object.values(req.headers).length > 0) {
    // if (!req.headers['x-folizon-access-token']) {
    //   isVerifyHeader = false;
    // } else
    // if (
    //   !req.headers['Content-Type'] ||
    //   (req.headers['Content-Type'] !== 'application/json' &&
    //     req.headers['Content-Type'] !== 'application/json; charset=utf-8')
    // ) {
    //   isVerifyHeader = false;
    // }
    // }
    // return isVerifyHeader ? next() : sendApiResponseData(res, EnumResult.ERROR_HEADER);
    return next();
  },
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

type RedisCacheMiddleware = {
  cacheKey: {
    key: string;
    field?: string;
  };
  ttl?: number;
};

export const redisCacheMiddleware = ({ cacheKey, ttl = DEFAULT_CACHE_TIME }: RedisCacheMiddleware) => {
  return async (req: Request & any, res: Response, next: NextFunction) => {
    req.saveCache = value => {
      RedisCacheManager.setCache(cacheKey, value, ttl);
    };
    const { key, field = '' } = cacheKey;
    const cached = await RedisCacheManager.getCache(cacheKey);

    if (cached) {
      if (cached !== 'updating') {
        infoLog(`Hit: ${key}:${field}`);
        return sendApiResponseData(res, EnumResult.SUCCESS, {
          data: cached,
        });
        // return res.status(200).send(cached);
      }
      const start = new Date().getTime();
      infoLog(`Wait: ${key}:${field}`);

      while (new Date().getTime() - start > MAX_WAIT) {
        await delay(INTERVAL);
        const data = await RedisCacheManager.getCache({ key, field });
        if (data && data !== 'updating') {
          infoLog(`Receive: ${key}:${field}`);
          // return res.status(200).send(data);
          return sendApiResponseData(res, EnumResult.SUCCESS, {
            data: cached,
          });
        }
      }
      errorLog(`Error: ${key}:${field}`);
      return next();
    } else {
      warningLog(`Miss: ${key}:${field}`);
      return next();
    }
  };
};

export default commonMiddleware;
