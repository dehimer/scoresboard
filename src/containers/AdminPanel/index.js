import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  Table, TableHead,  TableBody, TableFooter,
  TablePagination, TableRow, TableCell
} from '@material-ui/core'

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
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default
    }
  }
});

import './index.scss'

class AdminPanel extends Component {
  state = {
    page: 0,
    rowsPerPage: 10
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

  render() {
    const { players_count: rowsLength=0, players: rows=[], classes } = this.props;
    const { rowsPerPage, page } = this.state;

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
                      <TableRow  className={classes.row} key={row.code}>
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
                    component='div'
                    className='admin-panel__pagination'
                    colSpan={3}
                    count={rowsLength}
                    rowsPerPage={rowsPerPage}
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
