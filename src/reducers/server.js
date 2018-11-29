const defaultState = {};

export default function reducer(state = defaultState, action) {
  const { type, data } = action;
  switch(type){
    case 'registrationPoints':
      return { ...state, registrationPoints: data };
    case 'activities':
      return { ...state, activities: data };
    case 'currency':
      return { ...state, currency: data };
    case 'allSpendMessage':
      return { ...state, allSpendMessage: data };
    case 'denyMessage':
      return { ...state, denyMessage: data };
    case 'topten':
      return { ...state, topten: data };
    case 'player_updated':
      return { ...state, updated_player: data };
    case 'players_count':
      return { ...state, players_count: data };
    case 'players':
      return { ...state, players: data };
    case 'players_update_ts':
      return { ...state, players_update_ts: data };
    default:
      return state;
  }
}
