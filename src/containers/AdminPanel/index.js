import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  Table, TableHead,  TableBody, TableFooter,
  TablePagination, TableRow, TableCell,
  Dialog
} from '@material-ui/core'

import EditPlayer from './components/EditPlayer'

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
    playerInEdit: null
  };

  componentDidMount() {
    const { getPlayersCount } = this.props;
    getPlayersCount();

    this.updateTable();
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps');
    console.log(nextProps);
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
    const { getPlayers } = this.props;
    const { page, rowsPerPage: rowsCount } = this.state;

    getPlayers({page, rowsCount})
  }

  opendEdit(player) {
    this.setState({
      playerInEdit: player
    })
  }

  handleEditClose() {
    this.setState({
      playerInEdit: null
    })
  }

  render() {
    const { players_count: rowsLength=0, players: rows=[], classes } = this.props;
    const { rowsPerPage, page, playerInEdit } = this.state;

    return (
      <div className='admin-panel'>
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
                        onClick={() => this.opendEdit(row)}
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
        <Dialog open={ !!playerInEdit } onClose={::this.handleEditClose} aria-labelledby='simple-dialog-title'>
          <div className='admin-panel__edit-dialog-content'>
            <EditPlayer player={ playerInEdit }/>
          </div>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  const { players_count, players } = state.server;

  return {
    players_count,
    players
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPlayersCount: () => {
      dispatch({ type: 'server/get_players_count' });
    },
    getPlayers: (filter) => {
      dispatch({ type: 'server/get_players', data: { filter } });
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AdminPanel));
