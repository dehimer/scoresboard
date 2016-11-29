export default function reducer(state = {}, action){
  switch(action.type){
    case 'message':
      console.log('got message');
      // return {};
      return Object.assign({}, {message:action.data});
    default:
      return state;
  }
}