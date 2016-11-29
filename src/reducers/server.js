export default function reducer(state = {}, action){
  switch(action.type){
    case 'colors':
      return Object.assign({}, {colors:action.data});
    default:
      return state;
  }
}