import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Button } from 'react-bootstrap'

class PlayersList extends Component {
  constructor(props) {
    super(props);
  }
  handleClick(e) {
    this.props.deletePlayer(e.target.dataset.color);
  }
  render() {
    const players = this.props.players;
    return (
      <div>
        <Table responsive>
          <thead>
            <tr>
              <th>Цвет</th>
              <th>Номер</th>
              <th>Имя</th>
              <th>Email</th>
              <th>Баллы</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {
              players.map((player, index) => {
                const playerNum = parseInt(player.color, 16);
                return (<tr key={ index }>
                  <th><div style={{backgroundColor:'#'+player.color, width:'20px', height:'20px'}}></div></th>
                  <th>{ playerNum }</th>
                  <th>{ player.name }</th>
                  <th>{ player.email }</th>
                  <th>{ player.scores }</th>
                  <th>
                    <Button
                      data-color={ player.color }
                      onClick={ ::this.handleClick }>
                      Удалить
                    </Button>
                  </th>
                </tr>)
              })
            }
          </tbody>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = function (state) {
  return {
    players: state.server.players
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deletePlayer: (color) => {
      dispatch({type:'server/delete_player', data:color});
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayersList);