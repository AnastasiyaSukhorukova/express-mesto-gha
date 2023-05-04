const router = require('express').Router();
const { ERROR_CODE } = require('../constants/constants');

const userRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/users', userRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res) => {
  res.status(ERROR_CODE).send({ message: 'Произошла ошибка, страница не найдена!' });
});

module.exports = router;
