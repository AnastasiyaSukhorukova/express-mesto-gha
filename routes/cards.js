const router = require('express').Router();

const { getCards, removeCardId, createCard } = require('../controllers/users');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', removeCardId);

module.exports = router;
