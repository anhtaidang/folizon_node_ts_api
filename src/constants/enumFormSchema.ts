import { EnumSchsema } from './enumCommon';
import { TYPE_UINT16_MAX } from './constants';

export const SchemaGetProductByCollectionType = {
  type: 'object',
  properties: {
    postCollectionType: EnumSchsema.UInt8Schema,
    pageIndex: EnumSchsema.DoubleSchema,
    pageSize: EnumSchsema.UInt32Schema,
  },
  required: ['postCollectionType', 'pageIndex', 'pageSize'],
};

export const SchemaGetProductByCategory = {
  type: 'object',
  properties: {
    categoryRewrite: EnumSchsema.StringSchema,
    pageIndex: EnumSchsema.DoubleSchema,
    pageSize: EnumSchsema.UInt32Schema,
  },
  required: ['categoryRewrite', 'pageIndex', 'pageSize'],
};

export const SchemaGetProductByArtCollection = {
  type: 'object',
  properties: {
    artCollectionRewrite: EnumSchsema.StringSchema,
    pageIndex: EnumSchsema.DoubleSchema,
    pageSize: EnumSchsema.UInt32Schema,
  },
  required: ['artCollectionRewrite', 'pageIndex', 'pageSize'],
};

export const SchemaGetProductDetail = {
  type: 'object',
  properties: {
    productId: EnumSchsema.UInt64Schema,
  },
  required: ['productId'],
};
// =====================================================================================================================
export const SchemaUserCreateByUser = {
  type: 'object',
  properties: {
    personalInfo: {
      type: 'object',
      properties: {
        firstName: { type: 'string', minLength: 0, maxLength: 100 },
        lastName: { type: 'string', minLength: 0, maxLength: 100 },
        fullname: { type: 'string', minLength: 0, maxLength: 200 },
        phone: { type: 'string', minLength: 0, maxLength: 20 },
        address: { type: 'string', minLength: 0, maxLength: 200 },
        isActive: EnumSchsema.BooleanSchema,
      },
      required: ['fullname', 'firstName', 'lastName', 'phone', 'isActive', 'address'],
    },
    basicInfo: {
      type: 'object',
      properties: {
        avatar: EnumSchsema.StringSchema,
      },
      required: 'avatar',
    },
    accountInfo: {
      type: 'object',
      properties: {
        email: { type: 'string', minLength: 0, maxLength: 200 },
        username: { type: 'string', minLength: 0, maxLength: 100 },
        password: EnumSchsema.StringSchema,
      },
      required: ['email', 'username'],
    },
  },
  required: ['personalInfo', 'accountInfo'],
};

export const SchemaUserRegister = {
  type: 'object',
  properties: {
    avatar: EnumSchsema.StringSchema,
    username: { type: 'string', minLength: 0, maxLength: 100 },
    fullname: { type: 'string', minLength: 0, maxLength: 200 },
    phone: { type: 'string', minLength: 0, maxLength: 20 },
    provinceId: { type: 'integer', minLength: 0, maxLength: TYPE_UINT16_MAX },
    email: { type: 'string', minLength: 0, maxLength: 200 },
    hash: EnumSchsema.StringSchema,
    salt: EnumSchsema.StringSchema,
    password: EnumSchsema.StringSchema,
  },
  required: ['avatar', 'fullname', 'username', 'phone', 'email', 'provinceId', 'hash', 'password'],
};

export const SchemaUserUpdateByUser = {
  type: 'object',
  properties: {
    uid: EnumSchsema.Int32Schema,
    personalInfo: {
      type: 'object',
      properties: {
        firstName: { type: 'string', minLength: 0, maxLength: 100 },
        lastName: { type: 'string', minLength: 0, maxLength: 100 },
        fullname: { type: 'string', minLength: 0, maxLength: 200 },
        phone: { type: 'string', minLength: 0, maxLength: 20 },
        isActive: EnumSchsema.BooleanSchema,
      },
      required: ['fullname', 'firstName', 'lastName', 'phone', 'isActive'],
    },
    basicInfo: {
      type: 'object',
      properties: {
        avatar: EnumSchsema.StringSchema,
      },
      required: 'avatar',
    },
    acountInfo: {
      type: 'object',
      properties: {
        email: { type: 'string', minLength: 0, maxLength: 200 },
        username: { type: 'string', minLength: 0, maxLength: 100 },
        password: EnumSchsema.StringSchema,
      },
      required: ['email', 'username'],
    },
  },
  required: ['uid', 'accountInfo'],
};
// =====================================================================================================================

export const SchemaMediaUploadImage = {
  type: 'object',
  properties: {
    imageContent: EnumSchsema.StringSchema,
    folderType: EnumSchsema.UInt8Schema,
  },
  required: ['imageContent'],
};
