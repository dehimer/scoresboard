import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Table, Button } from 'react-bootstrap'

class PlayersList extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.syncAllPlayers();
  }
  removeAllPlayers(e) {
    this.props.removeAllPlayers(e.target.dataset.color);
  }
  render() {
    const players = this.props.players;
    return (
      <div>
        <Grid>
          <Row className='show-grid'>
            <Col>
              <Button
                onClick={ ::this.removeAllPlayers }>
                Удалить всех
              </Button>
            </Col>
          </Row>
          <Row className='show-grid'>
            <Col>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Цвет</th>
                    <th>Номер</th>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Баллы</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    players.map((player, index) => {
                      const playerNum = parseInt(player.color, 16);
                      return (<tr key={ index }>
                        <th><div style={{backgroundColor:'#'+this.props.colorsById[player.colorId].code, width:'20px', height:'20px'}}></div></th>
                        <th>{ playerNum }</th>
                        <th>{ player.name }</th>
                        <th>{ player.email }</th>
                        <th>{ player.scores }</th>
                      </tr>)
                    })
                  }
                </tbody>
              </Table>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = function (state) {
  return {
    players: state.server.all_players,
    colorsById: state.server.colorsById
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    syncAllPlayers: () => {
      dispatch({type:'server/all_players'});
    },
    removeAllPlayers: () => {
      dispatch({type:'server/clear'});
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayersList);