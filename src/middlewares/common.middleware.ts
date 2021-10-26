/* eslint-disable no-unused-vars */
import { validate } from 'jsonschema';
// import { EnumResult } from '@constants/enumCommon';
import { sendApiResponseData, sendApiResponseErrorParams } from '@controllers/utils';

const commonMiddleware = {
  verifyParseParam:
    (instance, method = 'POST', dataFormat = 'JSON', errorHandler = sendApiResponseErrorParams) =>
    (req, res, next) => {
      // console.log('verifyParseParam');
      const isVerifyParams = validate(req.body, instance).valid;
      return isVerifyParams ? next() : errorHandler(res);
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
