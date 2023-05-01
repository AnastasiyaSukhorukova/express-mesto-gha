// Завели express-сервер и настроили его запуск на 3000 порту по команде: npm run start

const express = require('express');
const mongoose = require('mongoose');

const path = require('path');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const router = require('./routes');

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// по вебинару
app.use(express.static(path.join(__dirname, 'public')));
app.use(router);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
