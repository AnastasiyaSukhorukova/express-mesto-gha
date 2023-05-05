const Card = require('../models/card');

const {
  ERROR_CODE,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  dafaultErrorMessage,
} = require('../constants/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {res.status(200).send(cards)})
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: dafaultErrorMessage }));
};

module.exports.removeCardId = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {res.status(200).send(card)})
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка не найдена.' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Передан некорректный id карточки.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: dafaultErrorMessage });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {res.status(201).send(card)
    console.log(card)})
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные в методы создания карточки.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: dafaultErrorMessage });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => {res.status(200).send(card)})
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка не найдена.' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для добавления лайка.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: dafaultErrorMessage });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => {res.status(200).send(card)})
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка не найдена.' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: dafaultErrorMessage });
    });
};
