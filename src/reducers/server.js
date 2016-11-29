export default function reducer(state = {}, action){
  console.log(action);
  switch(action.type){
    case 'colors':
      return Object.assign({}, state, {colors: action.data});
    case 'players':
      return Object.assign({}, state, {players: action.data});
    default:
      return state;
  }
}