import { TYPE_INT32_MAX, TYPE_INT32_MIN, TYPE_UINT16_MAX, TYPE_UINT32_MAX, TYPE_UINT64_MAX, TYPE_UINT8_MAX } from './constants';

export const EnumResult = {
  SUCCESS: 'success',
  FAILD: 'failed',
  ERROR: 'error',
  ERROR_HEADER: 'error_header',
  ERROR_PARAMS: 'error_params',
  ERROR_SERVER: 'error_server',
  ERROR_FORBIDDEN: 'error_forbidden',
  ERROR_ACCESS_TOKEN: 'error_access_token',
  ERROR_ACCESS_TOKEN_EXPIRED: 'error_access_token_expired',
  ERROR_ACCOUNT_INVALID: 'error_account_invalid',
  ERROR_AUTHOR: 'error_author',
  ERROR_DATA_INVALID: 'error_data_invalid',
  ERROR_INPUT_INVALID: 'error_input_invalid',
};

export const EnumSchsema = {
  UInt8Schema: { type: 'integer', minimum: 0, maximum: TYPE_UINT8_MAX },
  UInt16Schema: { type: 'integer', minimum: 0, maximum: TYPE_UINT16_MAX },
  UInt32Schema: { type: 'integer', minimum: 0, maximum: TYPE_UINT32_MAX },
  Int32Schema: { type: 'integer', minimum: TYPE_INT32_MIN, maximum: TYPE_INT32_MAX },
  UInt64Schema: { type: 'integer', minimum: 0, maximum: TYPE_UINT64_MAX },
  DoubleSchema: { type: 'number' },
  StringSchema: { type: 'string' },
  UFloatSchema: { type: 'number', minimum: 0 },
  BooleanSchema: { type: 'boolean' },
};
