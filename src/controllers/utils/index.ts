// import { ACCESS_TOKEN_HEADER } from '@constants/constants';
import { EnumResult } from '@constants/enumCommon';
import { NextFunction, Response } from 'express';

export function getTemplateResponse(data: any, resultCode: string = EnumResult.SUCCESS) {
  return {
    reply: data,
    result: resultCode,
  };
}

export const sendSuccess = (res, data) => {
  res.status(200).json(getTemplateResponse(data));
};

interface SendApiResponseDataConfig {
  data: any;
  status?: number;
}
export const sendApiResponseData = (res: Response, resultCode: string, { data = null, status = 200 }: SendApiResponseDataConfig) => {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  // res.setHeader(ACCESS_TOKEN_HEADER, resultCode);
  res.status(status).json(getTemplateResponse(data, resultCode));
  // return resultCode === EnumResult.SUCCESS;
};

export const sendFailed = (res, resultCode = EnumResult.FAILD, { data = null, status = 200 }: SendApiResponseDataConfig) => {
  res.status(status).json(getTemplateResponse(data, resultCode));
};

export const sendError =
  (res: Response, next: NextFunction, param = { status: 200, message: null, resultCode: EnumResult.ERROR }) =>
  error => {
    const { status, message, resultCode } = param;
    // next(error);
    res.status(status || error.status).json(
      getTemplateResponse(
        {
          type: 'error',
          message: message || error.message,
          error,
        },
        resultCode,
      ),
    );
  };

export const paginate = ({ pageIndex, pageSize }) => {
  const offset = pageIndex * pageSize;
  return {
    offset,
    limit: pageSize,
  };
};
