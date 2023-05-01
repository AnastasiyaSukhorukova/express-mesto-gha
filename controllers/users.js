// это файл контроллеров
const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Пользователь по указанному id не найден.' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан некорректный id пользователя.' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
  // по вебинару
  // const { userId } = req.params;
  // const user = User.find((item) => item._id === userId);
  // if (!user) {
  //   return res.status(404).send({ message: 'Пользователь по указанному id не найден.' }) else {
  //   res.send(user)
  // };
};
