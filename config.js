module.exports = {
  readers: [
    { id: 1, url: '' },
    { id: 2, url: '' },
    { id: 3, url: '' },
    { id: 4, url: '' },
    { id: 5, url: '' },
    { id: 6, url: '' },
    { id: 7, url: '' },
    { id: 8, url: '' },
    { id: 9, url: '' },
    { id: 10, url: '' },
    { id: 11, url: '' }
  ],
  registrationPoints: [
    { id: 1, readerId: 1 },
    { id: 2, readerId: 2 }
  ],
  activity: [
    { id: 1, readerId: 3, variants: [ { name: 'Drink coffee', price: 2 } ] },
    { id: 2, readerId: 4,
      variants: [
        { name: 'Eat burger', price: 4 },
        { name: 'Eat big burger', price: 6 },
        { name: 'Eat spice burger', price: 5 }
      ]
    },
    { id: 3, readerId: 5, variants: [ { name: 'Eat salad', price: 3 } ] },
    { id: 4, readerId: 6, variants: [] },
    { id: 5, readerId: 7, variants: [] },
    { id: 6, readerId: 8, variants: [] },
    { id: 7, readerId: 9, variants: [] },
    { id: 8, readerId: 10, variants: [] },
    { id: 9, readerId: 11, variants: [] },
  ]
};
