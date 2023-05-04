const cardsRouter = require('express').Router();

const {
  getCards,
  removeCardId,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/users');

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', removeCardId);
cardsRouter.put('/:cardId/likes', likeCard);
cardsRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardsRouter;
