import jwt from 'jsonwebtoken';
import config from 'config';
export const generateAuthToken = async (id: string | any) => {
  return jwt.sign({ id: id }, config.get('jwtSecret'), { expiresIn: '2d' });
};
export const decodeAuthToken = async (token: string) => {
  return jwt.verify(token, config.get('jwtSecret'));
};
