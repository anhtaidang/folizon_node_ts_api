import { ACCESS_TOKEN_HEADER } from '@constants/constants';
import { EnumResult } from '@constants/enumCommon';

export function getTemplateResponse(data, resultCode = EnumResult.SUCCESS) {
  return {
    reply: data,
    result: resultCode,
  };
}

export const sendSuccess = (res, data) => {
  res.status(200).json(getTemplateResponse(data));
};

export const sendApiResponseData = (res, resultCode, data = null) => {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader(ACCESS_TOKEN_HEADER, resultCode);
  res.status(200).json(getTemplateResponse(data, resultCode));
  return resultCode === EnumResult.SUCCESS;
};

export const sendFailed = (res, resultCode = EnumResult.FAILD, data = null) => {
  res.status(200).json(getTemplateResponse(data, resultCode));
};

export const sendError =
  (res, next, param = { status: 200, message: null, resultCode: EnumResult.ERROR }) =>
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

export const sendApiResponseErrorParams = res => {
  return sendApiResponseData(res, EnumResult.ERROR_PARAMS);
};

export const paginate = ({ pageIndex, pageSize }) => {
  const offset = pageIndex * pageSize;
  return {
    offset,
    limit: pageSize,
  };
};
