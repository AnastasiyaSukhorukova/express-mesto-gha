const router = require('express').Router();

const {
  getCards,
  removeCardId,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/users');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', removeCardId);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
