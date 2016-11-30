import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Table } from 'react-bootstrap'


class ScoreBoard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const players = this.props.players.sort((playerA, playerB) => {
      return +playerA.score > +playerB;
    });
    const playersByCols = [
      players.slice(0, 9),
      players.slice(9, 19)
    ];

    return (
      <div>
        <Grid>
          <Row className='show-grid'>
            {
              playersByCols.map((players, index) => (
                <Col key={ index } md={6} mdPush={6}>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Место</th>
                        <th>Номер</th>
                        <th>Имя</th>
                        <th>Время</th>
                        <th>Баллы</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        players.map((player, index) => {
                          
                          const place = index+1;
                          const num = parseInt(player.color, 16);
                          const time = player.time || '--:--'

                          return (<tr key={ index }>
                              <th>{ place }</th>
                              <th>{ num }</th>
                              <th>{ player.name }</th>
                              <th>{ time }</th>
                              <th>{ player.scores }</th>
                          </tr>)
                        })
                      }
                    </tbody>
                  </Table>
                </Col>
              ))
            }
          </Row>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = function (state) {
  return {
    players: state.server.players
  }
}

export default connect(
  mapStateToProps
)(ScoreBoard);