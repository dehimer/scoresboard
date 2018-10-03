import React, { Component } from 'react'
import { connect } from 'react-redux'
import Blank from './svg/Blank'
import Line from './svg/Line'

import './index.scss'

class TournamentTable extends Component {
  state = {
    page: 0,
    rowsPerPage: 14,
    dt: ''
  };

  componentDidMount() {
    const { getTournamentNumber } = this.props;
    getTournamentNumber();
    this.updateDT();
    this.updateTable();
  }

  componentWillReceiveProps(nextProps) {
    const {
      updated_player: updated_player_prev,
      added_player: added_player_prev,
      players_update_ts: players_update_ts_prev,
      tournament_number: tournament_number_prev
    } = this.props;

    const {
      updated_player: updated_player_next,
      added_player: added_player_next,
      players_update_ts: players_update_ts_next,
      tournament_number: tournament_number_next
    } = nextProps;

    if (JSON.stringify(updated_player_next) !== JSON.stringify(updated_player_prev)) {
      this.updateTable();
    } else if (JSON.stringify(added_player_prev) !== JSON.stringify(added_player_next)) {
      this.updateTable();
    } else if (players_update_ts_next !== players_update_ts_prev) {
      this.updateTable();
    }

    if (tournament_number_prev !== tournament_number_next) {
      this.updateDT();
    }
  }

  updateTable() {
    const { getPlayers, getPlayersCount } = this.props;
    const { page, rowsPerPage: rowsCount } = this.state;

    getPlayersCount();
    getPlayers({ page, rowsCount });
  }

  handleChangePage(event, page) {
    this.setState({ page }, () => {
      this.updateTable();
    });
  }

  handleChangeRowsPerPage(event) {
    this.setState({ rowsPerPage: event.target.value }, () => {
      this.updateTable();
    });
  }

  updateDT() {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;

    const yyyy = today.getFullYear();
    if(dd < 10){
      dd = '0' + dd;
    }
    if(mm < 10){
      mm = '0' + mm;
    }

    const dt = [dd, mm, yyyy].join('.');
    this.setState({ dt });
  }

  render() {
    const { players_count, players=[], topten, tournament_number } = this.props;
    const { rowsPerPage, page, dt } = this.state;
    console.log(players_count);
    console.log(rowsPerPage);
    console.log(topten);

    return (
      <div className='top-table'>
        <div className='top-table__blank'>
          <Blank/>
        </div>

        <div className='top-table__tournament-number'>{ tournament_number }</div>
        <div className='top-table__date-time'>{ dt }</div>
        {
          players.length ? (
            <div className='top-table__table'>
              {
                players.map((player, idx) => {
                  return (
                    <div
                      className='top-table__table-row'
                      key={player.code}
                    >
                      <div className='top-table__table-cell--idx'>{idx + page + 1}.</div>
                      <div className='top-table__table-cell--nickname'>{player.nickname}</div>
                      <div className='top-table__table-cell--code'>{player.code}</div>
                      <div className='top-table__table-cell--scores'>{player.scores}</div>
                      <div className='top-table__table-cell--line'>
                        <Line />
                      </div>
                    </div>
                  );
                })
              }

              {/*<TablePagination
                    component=
                    className='admin-panel__pagination'
                    count={ players_count }
                    rowsPerPage={ rowsPerPage }
                    rowsPerPageOptions={[10, 50, 100]}
                    page={ page }
                    onChangePage={::this.handleChangePage}
                    onChangeRowsPerPage={::this.handleChangeRowsPerPage}
                  />*/}
            </div>
          ) : (
            <div className='top-table__no-players'>Участников пока нет</div>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  const {
    players,
    players_count,
    tournament_number,
    added_player,
    updated_player,
    players_update_ts
  } = state.server;

  return {
    players,
    players_count,
    tournament_number,
    added_player,
    updated_player,
    players_update_ts
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPlayersCount: () => {
      dispatch({ type: 'server/get_players_count' });
    },
    getPlayers: (filter) => {
      dispatch({ type: 'server/get_top_players', data: { filter }});
    },
    getTournamentNumber: () => {
      dispatch({ type: 'server/get_tournament_number' });
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TournamentTable);
