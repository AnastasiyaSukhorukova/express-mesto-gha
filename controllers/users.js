// это файл контроллеров
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  ERROR_CODE,
  ERROR_CODE_NOT_FOUND,
} = require('../constants/constants');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

const getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь не найден.' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Передан некорректный id пользователя.' });
      }
      return next(err);
    });
};

module.exports.getUserById = (req, res, next) => getUserId(req.params.userId, res, next);
const getCurrentUser = (req, res, next) => getUserId(req.user._id, res, next);

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 16)
    .then((hash) => {
      User.create({
        email, password: hash, name, about, avatar,
      })
        .then((user) => {
          const noPasswordUser = user.toObject({ useProjection: true });
          return res.status(201).send(noPasswordUser);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return res.status(401).send({ message: 'Переданы некорректные данные при создании пользователя.' });
          }
          if (err.code === 11000) {
            return res.status(409).send({ message: 'Пользователь с указанным e-mail уже зарегистрирован' });
          }
          return next(err);
        });
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь не найден.' });
      }
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь не найден.' });
      }
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Неправильные почта или пароль.' });
      }
      // сравниваем переданный пароль и хеш из базы
      return bcrypt.compare(password, user.password)
      // eslint-disable-next-line consistent-return
        .then((matched) => {
          if (!matched) {
          // хеши не совпали — отклоняем промис
            return res.status(401).send({ message: 'Неправильные почта или пароль.' });
          }
        });
    })

    .then((user) => {
    // создадим токен
      const token = jwt.sign({ _id: user._id }, 's64517881e1a3e41c85fba33b', { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  getUserId,
  updateUser,
  updateAvatar,
  login,
};
