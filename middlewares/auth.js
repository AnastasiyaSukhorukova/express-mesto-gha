/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const AuthError = require('../errors/authError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, '2bc59e7789c14d292a3a5a1e08ad734211aa999007dc4eccab9868301900c2a6');
  } catch (err) {
    return next(new AuthError('Необходима авторизация (ошибка токена)'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
