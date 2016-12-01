import React, { Component } from 'react'
import { connect } from 'react-redux'

import './styles.scss'

class ScoreBoard extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.syncTop20players();
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
      <div className='scoreboard'>
        {
          playersByCols.map((players, index) => (
            <div key={ index } className='scoreboard__half'>
              <div className='scoreboard__header'>
                <div className='scoreboard__cell'>Место</div>
                <div className='scoreboard__cell'>Номер</div>
                <div className='scoreboard__cell'>Имя</div>
                <div className='scoreboard__cell'>Время</div>
                <div className='scoreboard__cell'>Баллы</div>
              </div>
              {
                players.map((player, index) => {
                  
                  const place = index+1;
                  const num = parseInt(player.color, 16);
                  const time = player.time || '--:--'

                  return (<div key={ index } className='scoreboard__row'>
                      <div className='scoreboard__cell'>{ place }</div>
                      <div className='scoreboard__cell'>{ num }</div>
                      <div className='scoreboard__cell'>{ player.name }</div>
                      <div className='scoreboard__cell'>{ time }</div>
                      <div className='scoreboard__cell'>{ player.scores }</div>
                  </div>)
                })
              }
            </div>

          ))
        }
      </div>
    )
  }
}

const mapStateToProps = function (state) {
  return {
    players: state.server.top20players
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    syncTop20players: () => {
      dispatch({type:'server/top20players'});
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScoreBoard);