import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

export const hashPassword = (password) => {
  return bcrypt.hashSync(password, salt);
};

export const verifyPassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};
