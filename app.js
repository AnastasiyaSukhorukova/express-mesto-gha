const express = require('express');
const mongoose = require('mongoose');

const catchErrorsMiddleware = require('./middlewares/errors');

const app = express();

const { PORT = 3000 } = process.env;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.use('/', require('./routes/index'));

app.use(catchErrorsMiddleware);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
