const defaultState = {
  top10players:[],
  all_players: []
};

export default function reducer(state = defaultState, action) {
  const { type, data } = action;
  switch(type){
    case 'player_added':
      return { ...state, last_added_player: data };
    case 'top10players':
      return { ...state, top10players: data };
    case 'all_players':
      return { ...state, all_players: data };
    default:
      return state;
  }
}
