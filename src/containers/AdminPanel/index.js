import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Table, TableBody, TableFooter, TablePagination, TableRow, TableCell } from '@material-ui/core'

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
        {
          rows.length > 0 ? (
            <Table>
              <TableBody>
                {
                  rows.map(row => {
                    return (
                      <TableRow key={row.code}>
                        <TableCell numeric>{row.code}</TableCell>
                        <TableCell component='th' scope='row'>
                          {row.nickname}
                        </TableCell>
                        <TableCell numeric>{row.email}</TableCell>
                        <TableCell numeric>{row.fullname}</TableCell>
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
