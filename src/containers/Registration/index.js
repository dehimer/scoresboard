import React, { Component } from 'react';
import { connect } from 'react-redux'

import NewPlayer from './components/NewPlayer'
import RegisteredPlayer from './components/RegisteredPlayer'
import PlayerID from './components/PlayerID'

import './index.scss'

class Registration extends Component {
  state = {
    player: {}
  };

  register(player) {
    this.props.addPlayer(player);
    this.setState({
      player
    })
  }

  findPlayer(player) {
    this.props.findPlayer(player);
    this.setState({
      player
    })
  }

  cleanupPlayer() {
    this.setState({
      player: {}
    })
  }

  componentWillReceiveProps(nextProps) {
    const { player } = this.state;
    const { last_added_player, last_found_player } = nextProps;

    if (last_added_player && last_added_player.email === player.email) {
      this.setState({
        player: last_added_player
      })
    }

    if (last_found_player && last_found_player.email === player.email) {
      this.setState({
        player: last_found_player
      })
    }
  }

  render() {
    const { player } = this.state;

    let content = null;

    if (player.code) {
      content = (
        <PlayerID player={player} cleanupPlayer={::this.cleanupPlayer} />
      )
    } else {
      content = (
        <React.Fragment>
          <NewPlayer register={::this.register}/>
          <RegisteredPlayer checkId={::this.findPlayer}/>
        </React.Fragment>
      )
    }

    return (
      <div className='registration'>
        { content }
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  const { last_added_player, last_found_player } = state.server;

  return {
    last_added_player,
    last_found_player
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addPlayer: (player) => {
      dispatch({ type: 'server/add_player', data: player });
    },
    findPlayer: (player) => {
      dispatch({ type: 'server/find_player', data: player });
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Registration);
