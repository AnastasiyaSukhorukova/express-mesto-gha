// это файл контроллеров

const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUsers = (req, res) => {
  return res.send(users);
}

module.exports.getUserId = (req, res) => {
  if (!users[req.params.id]) {
    res.send({error: `Такого пользователя не существует`});
    return;
}
}