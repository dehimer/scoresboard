import React, { Component } from 'react'
import { connect } from 'react-redux'
import PositionLine from 'components/PositionLine'

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
      players.slice(0, 10),
      players.slice(10, 20)
    ];

    return (
      <div className='scoreboard'>
        {
          playersByCols.map((players, index) => (
            <div key={ index } className='scoreboard__half'>
              {
                players.map((player, index) => {
                  
                  const place = index+1;
                  const colorId = player.colorId;
                  const color = colorId?('#'+this.props.colorsById[player.colorId].code):false;

                  return (<div>
                    <PositionLine color={ color }/>
                    <div key={ index } className='scoreboard__row'>
                      <div className='scoreboard__cell scoreboard__cell-place'>{ place }</div>
                      <div className='scoreboard__cell scoreboard__cell-name'>{ player.name }</div>
                      <div className='scoreboard__cell scoreboard__cell-scores'>{ player.scores }</div>
                    </div>
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
    players: state.server.top20players,
    colorsById: state.server.colorsById
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