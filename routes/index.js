const router = require('express').Router();
const { errors } = require('celebrate');

const userRouter = require('./users');
const cardsRouter = require('./cards');
const { login, createUser } = require('../controllers/users');
const { loginJoi, createUserJoi } = require('../middlewares/celebrate');

const NotFoundError = require('../errors/notFoundError');

const authMiddleware = require('../middlewares/auth');

router.post('/signin', loginJoi, login);
router.post('/signup', createUserJoi, createUser);

router.use(authMiddleware);
router.use('/users', userRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res, next) => next(new NotFoundError('404: Not Found.')));
router.use(errors({ message: 'Ошибка валидации данных!' }));

module.exports = router;
