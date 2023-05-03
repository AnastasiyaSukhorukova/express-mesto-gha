const router = require('express').Router();

const {
  getUsers,
  getUserId,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.post('/', createUser);
router.pach('/me', updateUser);
router.pach('/me/avatar', updateAvatar);

module.exports = router;
