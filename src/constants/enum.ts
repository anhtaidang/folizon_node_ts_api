/* eslint-disable object-shorthand,no-param-reassign,func-names,no-underscore-dangle */

export const EnumDateTimeFormatFull = 'YYYY-MM-DD HH:mm:ss';
export const EnumDateTimeFormatYYMMDD_HHMM = 'YYYY-MM-DD HH:mm';
export const EnumDateTimeFormatDDMMYYYY_HHMMSS = 'DD-MM-YYYY HH:mm:ss';
export const EnumDateTimeFormatYYMMDD = 'YYYY-MM-DD';
export const EnumDateTimeFormatYYMM = 'YYYY-MM';
export const EnumDateTimeFormatDDMMYY = 'DD-MM-YYYY';
export const EnumDateTimeFormatHHMMSS = 'HH:mm:ss';
export const EnumDateTimeFormatHHMM = 'HH:mm';

export const EnumDateTimeFormat_Sperator_Full = 'YYYY/MM/DD HH:mm:ss';
export const EnumDateTimeFormat_Sperator_YYYMMDD_HHMM = 'YYYY/MM/DD HH:mm';
export const EnumDateTimeFormat_Sperator_YYYMMDD = 'YYYY/MM/DD';
export const EnumDateTimeFormat_Sperator_DDMMYYYY = 'DD/MM/YYYY';
export const EnumDateTimeFormat_Sperator_DDMMYYYY_HHMM = 'DD/MM/YYYY HH:mm';

export const EnumSchemaPlugin = {
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
  toObject: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
};

export const EnumFolderType = {
  COMMON: {
    id: 1,
    title: 'Common',
    foldername: 'commmon',
  },
  PRODUCT: {
    id: 2,
    title: 'Product',
    foldername: 'product',
  },
  TAG: {
    id: 3,
    title: 'Tag',
    foldername: 'tag',
  },
  USER: {
    id: 4,
    title: 'User',
    foldername: 'user',
  },
  CATEGORY: {
    id: 5,
    title: 'Category',
    foldername: 'category',
  },
  SHOP: {
    id: 6,
    title: 'Shop',
    foldername: 'shop',
  },
  ART_COLLECTION: {
    id: 7,
    title: 'Art Collection',
    foldername: 'art-collection',
  },
};

export const EnumUserSelectBy = {
  username: 1,
  name: 1,
  _id: 1,
  isActive: 1,
};

export const EnumProductAvailibilityType = {
  IN_STOCK: {
    id: 1,
    title: 'In stock',
  },
  LOW_IN_STOCK: {
    id: 2,
    title: 'Low in stock',
  },
};

export const EnumProductCollectionType = {
  URGENT: {
    id: 1,
    title: 'Urgents',
    code: 'urgent',
  },
  BEST_DISCOUNT: {
    id: 2,
    title: 'Best discounts',
    code: 'best-discount',
  },
};

export const EnumProductStatusType = {
  REQUESTED: {
    id: 1,
    title: 'Requested',
  },
  APPROVED: {
    id: 2,
    title: 'Approved',
  },
  DENIED: {
    id: 3,
    title: 'Denied',
  },
};
