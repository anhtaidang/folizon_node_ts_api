import path from 'path';
import bcrypt from 'bcrypt';
import SHA256 from 'crypto-js/sha256';
import SHA1 from 'crypto-js/sha1';
import { EnumFolderType } from '@/constants/enum';
import config from 'config';
import { S3MediaConfig } from '@interfaces/s3Config.interface';

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */

export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export function isNullOrEmpty(value) {
  return value === undefined || Number.isNaN(value) || value === null || (typeof value === 'string' && value.trim() === '');
}

export function isEmptyObject(obj) {
  if (obj !== null && obj !== undefined) return Object.keys(obj).length === 0;
  return true;
}

export const getBooleanFromTinyint = (value: number): boolean => value !== 0;

export const slugify = string => {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return string
    ? string
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '')
    : ''; // Trim - from end of text
};

export function hashPassword(password, salt, verifyCode = process.env.SECRET_KEY) {
  return String(SHA256(String(SHA256(String(SHA1(password + salt)))) + verifyCode));
}

export const cryptPassword = (password, verifyCode = process.env.SECRET_KEY) => {
  const salt = bcrypt.genSaltSync(10);
  // const hash = bcrypt.hashSync(password, salt);
  return {
    salt,
    hash: hashPassword(password, salt, verifyCode),
  };
};

export function getFieldEnumConfig({ value, enumConfig, fieldName = 'title', keyCompare = 'id' }) {
  let valueReturn = '';
  Object.keys(enumConfig).forEach(key => {
    if (value === enumConfig[key][keyCompare] && !isNullOrEmpty(enumConfig[key][fieldName])) {
      valueReturn = enumConfig[key][fieldName];
    }
  });
  return valueReturn;
}

export const getPublicPath = () => path.resolve(config.get('publicDir'));

export const isUrl = s => {
  var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(s);
};

export const genMediaPathByFolderType = folderType =>
  `${getPublicPath()}/upload/media/${getFieldEnumConfig({
    value: folderType,
    enumConfig: EnumFolderType,
    fieldName: 'foldername',
  })}`;

export const genURLS3ByFolderType = (folderType, filename) => {
  if (isUrl(filename)) {
    return filename;
  }
  const s3MediaConfig: S3MediaConfig = config.get('s3Media');
  return `${s3MediaConfig.host}/media/${getFieldEnumConfig({
    value: folderType,
    enumConfig: EnumFolderType,
    fieldName: 'foldername',
  })}/${filename}`;
};

// export const genS3MediaUrlByFolderType = (folderType, filename) => {
//   if (isUrl(filename)) {
//     return filename;
//   }
//   const s3MediaConfig: S3MediaConfig = config.get('s3Media');
//   return `${s3MediaConfig.host}/media/${getFieldEnumConfig({
//     value: folderType,
//     enumConfig: EnumFolderType,
//     fieldName: 'foldername',
//   })}/${filename}`;
// };

export const getFileNameFromUrl = (url: string) => {
  const data = url?.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/);
  return data?.length > 0 ? data[0] : null;
};

export const validateUrl = (value: string) => {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value,
  );
};

export const genUrlMediaByFolderType = (protocol, host, folderType = EnumFolderType.COMMON.id, filename = '') => {
  return protocol && host
    ? `${protocol}://${host}/upload/media/${getFieldEnumConfig({
        value: folderType,
        enumConfig: EnumFolderType,
        fieldName: 'foldername',
      })}/${filename}`
    : '';
};

export function removeParamRequest(objectRequest, keysUncheck = []) {
  const requestData = { ...objectRequest };
  Object.keys(requestData).forEach(key => {
    if (!keysUncheck.includes(key)) {
      if (isNullOrEmpty(requestData[key])) {
        delete requestData[key];
      }
    }
  });
  return requestData;
}

export function validateImageBase64(value) {
  const imageBase64RegEx = /data:image\/([a-zA-Z]*);base64,([^\"]*)/;
  const regex = new RegExp(imageBase64RegEx);
  return regex.exec(value);
}

export function validateBase64(value) {
  if (!value) {
    return false;
  }
  const base64RegEx = /([a-zA-Z]*);base64,([^\"]*)/;
  const regex = new RegExp(base64RegEx);
  return regex.exec(value);
}
