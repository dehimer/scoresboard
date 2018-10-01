import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  Paper, Table, TableHead,  TableBody, TableFooter,
  TablePagination, TableRow, TableCell
} from '@material-ui/core'

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
    const { players_count: rowsLength=0, players: rows=[] } = this.props;
    const { rowsPerPage, page } = this.state;

    return (
      <div className='admin-panel'>
        <Paper>
          {
            rows.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Ник</TableCell>
                    <TableCell>ФИО</TableCell>
                    <TableCell>День рождения</TableCell>
                    <TableCell>Город</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Телефон</TableCell>
                    <TableCell>Модель ноутбука</TableCell>
                    <TableCell>Принёс ноутбук</TableCell>
                    <TableCell>Ссылка на соцсеть</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    rows.map(row => {
                      return (
                        <TableRow key={row.code}>
                          <TableCell numeric>{row.code}</TableCell>
                          <TableCell>{row.nickname}</TableCell>
                          <TableCell>{row.fullname}</TableCell>
                          <TableCell>{row.birthday}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>{row.city}</TableCell>
                          <TableCell>{row.phone}</TableCell>
                          <TableCell>{row.notebook}</TableCell>
                          <TableCell>{ row.broughtNotebook ? 'Да' : 'Нет'}</TableCell>
                          <TableCell>{row.link}</TableCell>
                        </TableRow>
                      );
                    })
                  }
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
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
              'Участников пока нет'
            )
          }
        </Paper>
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
)(AdminPanel);
