import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  Table, TableHead,  TableBody, TableFooter,
  TablePagination, TableRow, TableCell,
  Dialog
} from '@material-ui/core'

import MenuBar from '../../components/MenuBar'
import EditPlayer from './components/EditPlayer/index'
import ResetScoresDialog from './components/ResetScoresDialog/index'

import { withStyles } from '@material-ui/core/styles';
const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  },
  row: {
    cursor: 'pointer'
  }
});

import './index.scss'

class AdminPanel extends Component {
  state = {
    page: 0,
    rowsPerPage: 10,
    hoveredRowCode: null,
    playerInEdit: null,
    scoresInDelete: false
  };

  componentDidMount() {
    const { getPlayersCount } = this.props;
    getPlayersCount();

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

  updateTable() {
    const { getPlayers, getPlayersCount } = this.props;
    const { page, rowsPerPage: rowsCount } = this.state;

    getPlayersCount();
    getPlayers({page, rowsCount})
  }

  updatePlayer(data) {
    if (data) {
      const { updatePlayer } = this.props;
      updatePlayer({ code: this.state.playerInEdit.code, ...data});
    }

    this.setState({ playerInEdit: null });
  }

  deletePlayer(data) {
    if (data) {
      const { deletePlayer } = this.props;
      deletePlayer({ code: this.state.playerInEdit.code });
    }

    this.setState({ playerInEdit: null });
  }

  resetScores() {
    const { resetScores } = this.props;
    resetScores();
    this.setState({ scoresInDelete: false })
  }

  render() {
    const { players_count: rowsLength=0, players: rows=[], classes } = this.props;
    const { rowsPerPage, page, playerInEdit, scoresInDelete } = this.state;

    return (
      <div className='admin-panel'>
        <MenuBar resetScores={() => this.setState({ scoresInDelete: true })}/>
        {
          rows.length > 0 ? (
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <CustomTableCell>ID</CustomTableCell>
                  <CustomTableCell>Ник</CustomTableCell>
                  <CustomTableCell>ФИО</CustomTableCell>
                  <CustomTableCell>День рождения</CustomTableCell>
                  <CustomTableCell>Город</CustomTableCell>
                  <CustomTableCell>Email</CustomTableCell>
                  <CustomTableCell>Телефон</CustomTableCell>
                  <CustomTableCell>Модель ноутбука</CustomTableCell>
                  <CustomTableCell>Принёс ноутбук</CustomTableCell>
                  <CustomTableCell>Ссылка на соцсеть</CustomTableCell>
                  <CustomTableCell>Очки</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  rows.map(row => {
                    return (
                      <TableRow
                        className={classes.row} key={row.code}
                        onClick={() => this.setState({ playerInEdit: row })}
                        selected={this.state.hoveredRowCode === row.code}
                        onMouseOver={() => {this.setState({hoveredRowCode: row.code})}}
                        onMouseOut={() => {this.setState({hoveredRowCode: null})}}
                      >
                        <TableCell numeric>{row.code}</TableCell>
                        <TableCell>{row.nickname}</TableCell>
                        <TableCell>{row.fullname}</TableCell>
                        <TableCell>{row.birthday.split('-').reverse().join('.')}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.city}</TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell>{row.notebook}</TableCell>
                        <TableCell>{ row.broughtNotebook ? 'Да' : 'Нет'}</TableCell>
                        <TableCell>{row.link}</TableCell>
                        <TableCell>{row.scores}</TableCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    className='admin-panel__pagination'
                    count={rowsLength}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10, 50, 100]}
                    page={page}
                    onChangePage={::this.handleChangePage}
                    onChangeRowsPerPage={::this.handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          ) : (
            <div className='admin-panel__no-players'>Участников пока нет</div>
          )
        }
        <Dialog open={ !!playerInEdit } onClose={() => this.setState({ playerInEdit: null })} aria-labelledby='simple-dialog-title'>
          <div className='admin-panel__edit-dialog-content'>
            <EditPlayer onUpdate={::this.updatePlayer} onDelete={::this.deletePlayer} player={ playerInEdit }/>
          </div>
        </Dialog>

        {
          scoresInDelete
            ? <ResetScoresDialog
              handleCancel={() => this.setState({ scoresInDelete: false })}
              handleConfirm={::this.resetScores}/>
            : null
        }
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  const {
    players_count,
    players,
    added_player,
    updated_player,
    players_update_ts
  } = state.server;

  return {
    added_player,
    updated_player,
    players_count,
    players,
    players_update_ts
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPlayersCount: () => {
      dispatch({ type: 'server/get_players_count' });
    },
    getPlayers: (filter) => {
      dispatch({ type: 'server/get_players', data: { filter } });
    },
    updatePlayer: (player) => {
      dispatch({ type: 'server/update_player', data: player });
    },
    deletePlayer: (player) => {
      dispatch({ type: 'server/delete_player', data: player });
    },
    resetScores: () => {
      dispatch({ type: 'server/reset_scores' });
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AdminPanel));
