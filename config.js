module.exports = {
  readers: [
    { id: 1, url: '192.168.1.33' },
    { id: 2, url: '192.168.1.34' },
    { id: 3, url: '192.168.1.35' },
    { id: 4, url: '192.168.1.36' },
    { id: 5, url: '192.168.1.37' },
    { id: 6, url: '192.168.1.38' },
    { id: 7, url: '192.168.1.39' },
    { id: 8, url: '192.168.1.40' },
    { id: 9, url: '192.168.1.41' },
    { id: 10, url: '192.168.1.42' },
    { id: 11, url: '192.168.1.43' }
  ],
  registrationPoints: {
    1: { readerId: 1 },
    2: { readerId: 2 }
  },
  activities: {
    1: { readerId: 3, variants: [ { name: 'Drink coffee', price: 2 } ] },
    2: {
      readerId: 4,
      variants: [
        { name: 'Eat burger', price: 4 },
        { name: 'Eat big burger', price: 6 },
        { name: 'Eat spice burger', price: 5 }
      ]
    },
    3: { readerId: 5, variants: [ { name: 'Eat salad', price: 3 } ] },
    4: { readerId: 6, variants: [] },
    5: { readerId: 7, variants: [] },
    6: { readerId: 8, variants: [] },
    7: { readerId: 9, variants: [] },
    8: { readerId: 10, variants: [] },
    9: { readerId: 11, variants: [] },
  },
  db: {
    address: 'localhost',
    port: 27017,
    name: 'ilike'
  }
};
