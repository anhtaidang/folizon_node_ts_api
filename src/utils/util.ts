import bcrypt from 'bcrypt';
import SHA256 from 'crypto-js/sha256';
import SHA1 from 'crypto-js/sha1';

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

export const getBooleanFromTinyint = (value: number): boolean => value !== 0;

export const getFileNameFromUrl = url => {
  const data = url.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/);
  return data[0];
};

export const slugify = string => {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
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
