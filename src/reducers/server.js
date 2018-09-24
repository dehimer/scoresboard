const defaultState = {
  free_colors:[],
  colors:[],
  colorsById:{},
  top20players:[],
  active_players: [],
  all_players: [],
  screensaver_params: {
    videos:[]
  }
};

export default function reducer(state = defaultState, action) {
  const { type, data } = action;
  switch(type){
    case 'free_colors':
      return { ...state, free_colors: data };
    case 'colors':
      return { ...state, colors: data, colorsById: data.reduce((res, color) => {
        res[color.id] = color;
        return res;
      }, {})};
    case 'top20players':
      return { ...state, top20players: data };
    case 'active_players':
      return { ...state, active_players: data };
    case 'all_players':
      return { ...state, all_players: data };
    case 'screensaver_params':
      return { ...state, screensaver_params: data };
    default:
      return state;
  }
}
