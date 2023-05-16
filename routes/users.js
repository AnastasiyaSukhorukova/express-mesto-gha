const userRouter = require('express').Router();

const {
  getUsers,
  getUserId,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const { getUserIdJoi, updateAvatarJoi, updateUserJoi } = require('../middlewares/celebrate');

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);
userRouter.get('/:userId', getUserIdJoi, getUserId);
userRouter.patch('/me', updateUserJoi, updateUser);
userRouter.patch('/me/avatar', updateAvatarJoi, updateAvatar);

module.exports = userRouter;
