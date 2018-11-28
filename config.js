module.exports = {
  readers: [
    { outerId: 1, id: 1, note: 'стойка регистрации 1' },
    { outerId: 2, id: 2, note: 'стойка регистрации 2' },
    { outerId: 3, id: 3, note: 'проверка баланса' },
    { outerId: 4, id: 4, note: 'алкоголь 1' },
    { outerId: 5, id: 5, note: 'алкоголь 2' },
    { outerId: 6, id: 6, note: 'диван' },
    { outerId: 7, id: 7, note: 'выкинуть деньги' },
    { outerId: 8, id: 8, note: 'чай' },
    { outerId: 9, id: 9, note: 'фото' },
    { outerId: 10, id: 10, note: 'покурить' },
    { outerId: 11, id: 11, note: 'центрифуга' },
    { outerId: 12, id: 12, note: 'VR' }
  ],
  registrationPoints: {
    1: { readerId: 1 },
    2: { readerId: 2 }
  },
  activities: {
    1: {
      readerId: 3,
      text: 'Для проверки баланса поднесите карту к считывателю',
      balanceChecking: true
    },
    2: {
      readerId: 4,
      variants: [
        { text: 'Пангалактический грызлодер', price: 29900432 },
        { text: 'Single malt whiskey 2019 Y.O.', price: 43424234 },
        { text: 'Водка «Сверхновая»', price: 34254222 },
        { text: 'Вино «Туманность Андромеды»', price: 37751154 },
        { text: 'Вино «Красный гигант»', price: 26654432 },
        { text: 'Шампанское «Уле Тай»', price: 31132143 },
        { text: 'Сок «Маковый томат»', price: 26642254 },
        { text: 'Сок «Апельсиновый расколбас»', price: 31132142 },
        { text: 'Сок титановых яблок', price: 34201102 },
        { text: 'Сок «Галактическая мешанина»', price: 28341865 }
      ],
      response: [
        'Прекрасный выбор, [name]!',
        '[spend]',
        '[balance]'
      ],
      delay: 2
    },
    3: {
      readerId: 5,
      variants: [
        { text: 'Пангалактический грызлодер', price: 29900432 },
        { text: 'Single malt whiskey 2019 Y.O.', price: 43424234 },
        { text: 'Водка «Сверхновая»', price: 34254222 },
        { text: 'Вино «Туманность Андромеды»', price: 37751154 },
        { text: 'Вино «Красный гигант»', price: 26654432 },
        { text: 'Шампанское «Уле Тай»', price: 31132143 },
        { text: 'Сок «Маковый томат»', price: 26642254 },
        { text: 'Сок «Апельсиновый расколбас»', price: 31132142 },
        { text: 'Сок титановых яблок', price: 34201102 },
        { text: 'Сок «Галактическая мешанина»', price: 28341865 }
      ],
      response: [
        'Прекрасный выбор, [name]!',
        '[spend]',
        '[balance]'
      ],
      delay: 2
    },
    4: {
      readerId: 6,
      variants: [
        { text: 'Хотите посидеть на диване за 10.345.321¤?', price: 10345321, hiddenPrice: true }
      ],
      response: [
        '[name]!',
        '[spend',
        '[balance]',
        'Наслаждайтесь концом света!'
      ],
      delay: 5
    },
    5: {
      header: 'Сколько Альтаирских рублей ¤ вы хотите выкинуть в открытый космос?',
      readerId: 7,
      variants: [
        { text: 'Галактически много', price: 5154234, hiddenPrice: true },
        { text: 'Много', price: 10432754, hiddenPrice: true },
        { text: 'Мало', price: 30742275, hiddenPrice: true },
        { text: 'Карликово мало', price: 80021024, hiddenPrice: true }
      ],
      accept: [
        'Вы хотите выкинуть [variant] Альтаирских рублей?',
        'Для выкидывания поднесите карту Галактибанка'
      ],
      response: [
        '[name], вы только что выкинули в космос [price][currency].',
        'Это было совершенно бессмысленно!',
        'Поздравляем!',
        '[balance]'
      ],
      delay: 30
    },
    6: {
      readerId: 8, variants: [
        { text: 'Ультра-чай', price: 51234235 },
        { text: 'Бетельгезийский улун', price: 52532986 },
        { text: 'Вогонский бергамот', price: 55664023 },
        { text: 'Дыхание Хулуву', price: 57793238 }
      ],
      response: [
        '[name], попробовать инопланетный чай – импульсивный, необдуманный, но смелый поступок! УРА!',
        '[spend]',
        '[balance]'
      ],
      delay: 2
    },
    7: {
      readerId: 9,
      variants: [
        {
          text: [
            'Хотите получить свое фото в ретро-стиле 21-го века на доисторической фотобумаге?',
            'Стоимость услуги 10.375¤'
          ],
          price: 10375,
          hiddenPrice: true
        }
      ],
      response: [
        '[name], уверены, что результат вам понравится. Наш доисторический принтер печатает фото несколько минут. Можете за ним вернуться позже',
        '[spend]',
        '[balance]'
      ],
      delay: 2
    },
    8: {
      readerId: 10,
      variants: [
        {
          text: 'Хотите ли вы покурить за 10.322.567¤?',
          price: 10322567,
          hiddenPrice: true
        }
      ],
      response: [
        'Правильно, [name]!',
        'Нет смысла заботиться о здоровье в конце Вселенной!',
        '[spend]',
        '[balance]'
      ],
      delay: 2
    },
    9: {
      readerId: 11,
      variants: [
        {
          text: [
            'Хотите узнать как трудно было космонавтам на заре космических путешествий?',
            'Всего 203.744.063¤'
          ],
          price: 203744063,
          hiddenPrice: true
        }
      ],
      response: [
        'Правильно, [name]!',
        'Это не на много страшнее чем путешествия во времени',
        '[spend]',
        '[balance]'
      ],
      delay: 30
    },
    10: {
      readerId: 12,
      variants: [
        {
          text: [
            'Хотите пережить величайшее сражение межгалактического флота за всю историю галактики?',
            'Всего 152.744.063¤'
          ],
          price: 152744063,
          hiddenPrice: true
        }
      ],
      response: [
        'Приятного вечера, [name]!',
        '[spend]',
        'Спойлер: Никто не умер ))',
        '[balance]'
      ],
      delay: 20
    }
  },
  allSpendMessage: [
    '[name]! Поздравляем!',
    'Вы потратили все [startBalance]',
    'Теперь для Вас все бесплатно!'
  ],
  denyMessage: [
    'Сожалеем, эквайринг Галактибанка не способен обрабатывать транзакции с такой скоростью.',
    'Попробуйте повторить позже.'
  ],
  startBalance: 999999999,
  currency: '¤',
  db: {
    address: 'localhost',
    port: 27017,
    name: 'ilike'
  }
};
