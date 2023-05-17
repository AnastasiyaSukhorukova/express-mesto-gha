// это файл контроллеров
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const AuthError = require('../errors/authError');
const ConflictError = require('../errors/conflictError');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

const getUserId = (id, res, next) => {
  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь не найден.'));
      }
      return next(err);
    });
};

const getUserById = (req, res, next) => getUserId(req.params.userId, res, next);
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
            return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
          }
          if (err.code === 11000) {
            return next(new ConflictError('Пользователь с указанным e-mail уже зарегистрирован.'));
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
        return next(new NotFoundError('Пользователь не найден.'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
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
        return next(new NotFoundError('Пользователь не найден.'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new AuthError('Неправильные почта или пароль.'));
      }
      // сравниваем переданный пароль и хеш из базы
      return bcrypt.compare(password, user.password)
      // eslint-disable-next-line consistent-return
        .then((matched) => {
          if (!matched) {
          // хеши не совпали — отклоняем промис
            return next(new AuthError('Неправильные почта или пароль.'));
          }
          const token = jwt.sign(
            { _id: user._id },
            '2bc59e7789c14d292a3a5a1e08ad734211aa999007dc4eccab9868301900c2a6',
            { expiresIn: '7d' },
          );
          return res.send({ token });
        });
    })
    .catch(next);
};

module.exports = {
  getUserById,
  getUsers,
  createUser,
  getCurrentUser,
  getUserId,
  updateUser,
  updateAvatar,
  login,
};
