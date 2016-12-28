import React, { Component } from 'react'
import { connect } from 'react-redux'
import PositionLine from 'components/PositionLine'
import ScreenSaver from 'components/ScreenSaver'
import TimeFormat from 'hh-mm-ss'
import classNames from 'classnames'

import './styles.scss'

class ScoreBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active_bg_images: 0
    }
  }
  componentWillMount() {
    this.props.syncTop20players();
    this.props.syncActivePlayers();
  }
  componentDidMount() {
    setInterval(() => {
      console.log('active_bg_images: '+this.state.active_bg_images);

      this.setState({active_bg_images: (this.state.active_bg_images+1)%4});
    }, 10000);
  }
  render() {
    const {active_bg_images} = this.state;
    const {players} = this.props;

    const playersByCols = [
      players.slice(0, 10),
      players.slice(10, 20)
    ];

    let showscreensaver;
    if(!this.props.active_players.length && this.props.screensaver_params.videos.length){
      showscreensaver = <ScreenSaver params={ this.props.screensaver_params }/>
    }

    // this.setState({

    // })

    return (
      <div className='scoreboard'>
        <div className='scoreboard__background'>
          <img className={classNames('scoreboard__background_img', {'scoreboard__background_img--active': active_bg_images === 0})} src={require('../../assets/images/bg_1.png')}/>
          <img className={classNames('scoreboard__background_img', {'scoreboard__background_img--active': active_bg_images === 1})} src={require('../../assets/images/bg_2.png')}/>
          <img className={classNames('scoreboard__background_img', {'scoreboard__background_img--active': active_bg_images === 2})} src={require('../../assets/images/bg_3.png')}/>
          <img className={classNames('scoreboard__background_img', {'scoreboard__background_img--active': active_bg_images === 3})} src={require('../../assets/images/bg_4.png')}/>
        </div>
        <img className='scoreboard__logo_back' src={require('../../assets/images/logo_back.png')}/>
        <img className='scoreboard__logo' src={require('../../assets/images/logo.png')}/>

        {
          playersByCols.map((players, colIndex) => (
            <div key={ colIndex } className='scoreboard__half'>
              <div className='scoreboard__labels'>
                <img className='scoreboard__labels-place' src={require('../../assets/images/hash.png')} />
                <div className='scoreboard__labels-name'></div>
                <img className='scoreboard__labels-time' src={require('../../assets/images/clock.png')} />
                <img className='scoreboard__labels-scores' src={require('../../assets/images/radio.png')} />
              </div>
              {
                players.map((player, index) => {
                  
                  const place = index+1+10*colIndex;
                  const time = +player.time >0 ? TimeFormat.fromS(+player.time) : '00:00';
                  
                  const colorId = player.colorId;
                  const color = colorId?('#'+this.props.colorsById[player.colorId].code):false;

                  return (<div key={ index }>
                    <PositionLine color={ color }/>
                    <div className='scoreboard__row'>
                      <div className='scoreboard__cell scoreboard__cell-place'>{ place }</div>
                      <div className='scoreboard__cell scoreboard__cell-name'>{ player.name }</div>
                      <div className='scoreboard__cell scoreboard__cell-scores'>{ time }</div>
                      <div className='scoreboard__cell scoreboard__cell-scores'>{ player.scores }</div>
                    </div>
                  </div>)
                })
              }
            </div>

          ))
        }
        { showscreensaver }
      </div>
    )
  }
}

const mapStateToProps = function (state) {
  return {
    players: state.server.top20players,
    active_players: state.server.active_players,
    colorsById: state.server.colorsById,
    screensaver_params: state.server.screensaver_params
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    syncTop20players: () => {
      dispatch({type:'server/top20players'});
    },
    syncActivePlayers: () => {
      dispatch({type:'server/active_players'});
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScoreBoard);