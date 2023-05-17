const Card = require('../models/card');

const {
  CODE_OK,
  CODE_CREATED,
} = require('../constants/constants');

const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');

module.exports.getCards = (req, res, next) => {
  Card.find({}).populate(['owner', 'likes'])
    .then((cards) => res.status(CODE_OK).send(cards))
    .catch(next);
};

module.exports.removeCardId = (req, res, next) => {
  const currentUserId = req.user._id;
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      const ownerId = card.owner.toString();
      if (ownerId !== currentUserId) {
        throw new ForbiddenError('Ошибка прав доступа.');
      }
      return card;
    })
    .then((card) => Card.deleteOne(card))
    .then((card) => res.status(CODE_OK).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Карточка не найдена.'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный id карточки.'));
      }
      return next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(CODE_CREATED).send(card))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.status(CODE_OK).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Карточка не найдена.'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для добавления лайка.'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.status(CODE_OK).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Карточка не найдена.'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
      }
      return next(err);
    });
};
