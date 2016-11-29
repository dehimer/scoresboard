export default function reducer(state = {}, action){
  switch(action.type){
    case 'colors':
      return Object.assign({}, {colors: action.data});
    case 'players':
      return Object.assign({}, {players: action.data});
    default:
      return state;
  }
}