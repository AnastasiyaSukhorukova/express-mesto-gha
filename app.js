const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());

// id созданного пользователя
app.use((req, res, next) => {
  req.user = {
    _id: '64517881e1a3e41c85fba33b',
  };
  next();
});

app.use(router);

mongoose.connect('mongodb://localhost:27017/mestodb', {
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
