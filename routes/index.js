const router = require('express').Router();
const { errors } = require('celebrate');
const { ERROR_CODE_NOT_FOUND } = require('../constants/constants');

const userRouter = require('./users');
const cardsRouter = require('./cards');
const { login, createUser } = require('../controllers/users');
const { loginJoi, createUserJoi } = require('../middlewares/celebrate');

const authMiddleware = require('../middlewares/auth');

router.post('/signin', loginJoi, login);
router.post('/signup', createUserJoi, createUser);

router.use(authMiddleware);
router.use('/users', userRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: '404: Not Found' });
});
router.use(errors({ message: 'Ошибка валидации данных!' }));

module.exports = router;
