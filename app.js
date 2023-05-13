const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.use(router);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
