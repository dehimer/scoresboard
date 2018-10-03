const defaultState = {
  top10players:[],
  all_players: []
};

export default function reducer(state = defaultState, action) {
  const { type, data } = action;
  switch(type){
    case 'player_added':
      return { ...state, added_player: data };
    case 'found_player':
      return { ...state, found_player: data };
    case 'player_updated':
      return { ...state, updated_player: data };
    case 'tournament_number':
      return { ...state, tournament_number: data };
    case 'players_count':
      return { ...state, players_count: data };
    case 'top_players_count':
      return { ...state, top_players_count: data };
    case 'players':
      return { ...state, players: data };
    case 'players_update_ts':
      return { ...state, players_update_ts: data };
    default:
      return state;
  }
}
