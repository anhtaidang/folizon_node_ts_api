/* eslint-disable no-unused-vars */
import { validate } from 'jsonschema';
// import { EnumResult } from '@constants/enumCommon';
import { sendApiResponseData } from '@controllers/utils';
import { NextFunction, Request, Response } from 'express';
import { EnumResult } from '@constants/enumCommon';

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

export default commonMiddleware;
