const express = require('express');
const mongoose = require('mongoose');

const app = express();
const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/users', require('./routes/users'));

// id созданного пользователя
app.use((req, res, next) => {
  req.user = {
    _id: '64517881e1a3e41c85fba33b',
  };
  next();
});
