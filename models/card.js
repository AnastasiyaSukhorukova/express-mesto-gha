// схема карточки

const cardSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: ObjectId,
    required: true
  },
  likes: {
    type: ObjectId,
    default: [], // пустой массив
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// создание моделей
module.exports = mongoose.model('card', cardSchema);