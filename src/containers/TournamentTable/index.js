import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow } from '@material-ui/core';
import PredatorLogoImg from './svg/PredatorLogoImg'
import PredatorLogoName from './svg/PredatorLogoName'
import AcerLogoImg from './svg/AcerLogoImg'

import './index.scss'

class TournamentTable extends Component {
  state = {
    page: 0,
    rowsPerPage: 10
  };

  componentDidMount() {
    const { getTournamentNumber } = this.props;
    getTournamentNumber();
    this.updateTable();
  }

  componentWillReceiveProps(nextProps) {
    const {
      updated_player: updated_player_prev,
      added_player: added_player_prev,
      players_update_ts: players_update_ts_prev
    } = this.props;

    const {
      updated_player: updated_player_next,
      added_player: added_player_next,
      players_update_ts: players_update_ts_next
    } = nextProps;

    if (JSON.stringify(updated_player_next) !== JSON.stringify(updated_player_prev)) {
      this.updateTable();
    } else if (JSON.stringify(added_player_prev) !== JSON.stringify(added_player_next)) {
      this.updateTable();
    } else if (players_update_ts_next !== players_update_ts_prev) {
      this.updateTable();
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

  render() {
    const { players_count, players=[], topten, tournament_number } = this.props;
    const { rowsPerPage, page } = this.state;

    return (
      <div className='top-table'>
        <div className='top-table__predator-logo-img'>
          <PredatorLogoImg/>
        </div>

        <div className='top-table__predator-logo-name'>
          <PredatorLogoName/>
        </div>

        <div className='top-table__acer-logo-img'>
          <AcerLogoImg/>
        </div>

        <div>Турнир: { tournament_number }</div>
        {
          players.length ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Очки</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Ник</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  players.map(player => {
                    return (
                      <TableRow
                        key={player.code}
                      >
                        <TableCell>{player.scores}</TableCell>
                        <TableCell>{player.code}</TableCell>
                        <TableCell>{player.nickname}</TableCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
              {
                !topten ? (
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        className='admin-panel__pagination'
                        count={ players_count }
                        rowsPerPage={ rowsPerPage }
                        rowsPerPageOptions={[10, 50, 100]}
                        page={ page }
                        onChangePage={::this.handleChangePage}
                        onChangeRowsPerPage={::this.handleChangeRowsPerPage}
                      />
                    </TableRow>
                  </TableFooter>
                ) : null
              }
            </Table>
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
