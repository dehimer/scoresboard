export default function reducer(state = {
  free_colors:[],
  colors:[],
  colorsById:{},
  top20players:[],
  active_players: [],
  all_players: [],
  screensaver_params: {
    videos:[]
  }
}, action) {
  console.log(action);
  switch(action.type){
    case 'free_colors':
      return {...state, free_colors: action.data};
    case 'colors':
      return {...state, colors: action.data, colorsById:action.data.reduce((res, color) => {
        res[color.id] = color;
        return res;
      }, {})};
    case 'top20players':
      return {...state, top20players: action.data};
    case 'active_players':
      return {...state, active_players: action.data};
    case 'all_players':
      return {...state, all_players: action.data};
    case 'screensaver_params':
      return {...state, screensaver_params: action.data};
    default:
      return state;
  }
}