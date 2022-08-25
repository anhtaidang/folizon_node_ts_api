export const warningLog = mess => {
  console.log('\x1b[33m%s\x1b[0m', mess);
};

export const infoLog = mess => {
  console.log('\x1b[32m%s\x1b[0m', mess);
};

export const errorLog = mess => {
  console.log('\x1b[31m%s\x1b[0m', mess);
};
