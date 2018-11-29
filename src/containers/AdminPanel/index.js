import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  Table, TableHead,  TableBody, TableFooter,
  TablePagination, TableRow, TableCell,
  Dialog
} from '@material-ui/core'

import MenuBar from '../../components/MenuBar'
import EditPlayer from './components/EditPlayer/index'

import { withStyles } from '@material-ui/core/styles';
const CustomTableCell = withStyles(theme => ({
  head: {
    fontSize: 35,
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 25,
    color: theme.palette.common.black
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
  },
  overrides: {
    MuiTableFooter: {
      color: 'white',
      backgroundColor: 'red'
    }
  }
});

import './index.scss'

class AdminPanel extends Component {
  state = {
    page: 0,
    rowsPerPage: 10,
    hoveredRowRfid: null,
    playerInEdit: null
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
      updatePlayer({ rfid: this.state.playerInEdit.rfid, ...data});
    }

    this.setState({ playerInEdit: null });
  }

  deletePlayer(data) {
    if (data) {
      const { deletePlayer } = this.props;
      deletePlayer({ rfid: this.state.playerInEdit.rfid });
    }

    this.setState({ playerInEdit: null });
  }

  render() {
    const { players_count: rowsLength=0, players: rows=[], classes, deletePlayers } = this.props;
    const { rowsPerPage, page, playerInEdit } = this.state;

    return (
      <div className='admin-panel'>
        <MenuBar deletePlayers={ deletePlayers }/>
        {
          rows.length > 0 ? (
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <CustomTableCell>RFID</CustomTableCell>
                  <CustomTableCell>Имя</CustomTableCell>
                  <CustomTableCell>Фамилия</CustomTableCell>
                  <CustomTableCell>Потратил</CustomTableCell>
                  <CustomTableCell>Осталось</CustomTableCell>
                  <CustomTableCell>Изначально</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  rows.map(row => {
                    return (
                      <TableRow
                        className={classes.row} key={row.rfid}
                        onClick={() => this.setState({ playerInEdit: row })}
                        selected={ this.state.hoveredRowRfid === row.rfid }
                        onMouseOver={() => {this.setState({ hoveredRowRfid: row.rfid })}}
                        onMouseOut={() => {this.setState({ hoveredRowRfid: null })}}
                      >
                        <CustomTableCell>{row.rfid}</CustomTableCell>
                        <CustomTableCell>{row.firstName}</CustomTableCell>
                        <CustomTableCell>{row.lastName}</CustomTableCell>
                        <CustomTableCell numeric>{row.spend}</CustomTableCell>
                        <CustomTableCell numeric>{row.balance}</CustomTableCell>
                        <CustomTableCell numeric>{row.startBalance}</CustomTableCell>
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
                    rowsPerPageOptions={[10, 50, 100, 500, 1000]}
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
    deletePlayers: () => {
      dispatch({ type: 'server/delete_all_players' });
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AdminPanel));
