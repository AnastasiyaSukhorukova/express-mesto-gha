const router = require('express').Router();
const { ERROR_CODE_NOT_FOUND } = require('../constants/constants');

const userRouter = require('./users');
const cardsRouter = require('./cards');
const { login, createUser } = require('../controllers/users');

const authMiddleware = require('../middlewares/auth');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(authMiddleware);
router.use('/users', userRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: '404: Not Found' });
});

module.exports = router;
