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
    case 'players':
      return { ...state, players: data };
    case 'top10_players':
      return { ...state, top10_players: data };
    case 'all_players':
      return { ...state, all_players: data };
    default:
      return state;
  }
}
