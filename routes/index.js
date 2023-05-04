const router = require('express').Router();
const { ERROR_CODE } = require('../constants/constants');

const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res) => {
  res.status(ERROR_CODE).send({ message: 'Ошибка. Введите корректный URL' });
});

module.exports = router;
