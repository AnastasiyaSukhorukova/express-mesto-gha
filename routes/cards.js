const cardsRouter = require('express').Router();

const {
  getCards,
  createCard,
  removeCardId,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const { createCardJoi, checkCardIdJoi } = require('../middlewares/celebrate');

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCardJoi, createCard);
cardsRouter.delete('/:cardId', checkCardIdJoi, removeCardId);
cardsRouter.put('/:cardId/likes', checkCardIdJoi, likeCard);
cardsRouter.delete('/:cardId/likes', checkCardIdJoi, dislikeCard);

module.exports = cardsRouter;
