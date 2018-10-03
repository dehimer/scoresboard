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
    this.setState({
      player
    }, () => {
      this.props.addPlayer(player);
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
    const { added_player: added_player_next, found_player: found_player_next } = nextProps;
    const { added_player: added_player_prev, found_player: found_player_prev } = this.props;

    if (added_player_next && this.state.player.email === added_player_next.email) {
      if (!added_player_prev || added_player_next.code !== added_player_prev.code) {
        this.setState({
          player: added_player_next
        })
      }
    }

    if (found_player_next) {
      if (!found_player_prev || found_player_next.code !== found_player_prev.code) {
        this.setState({
          player: found_player_next
        })
      }
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
  const { added_player, found_player } = state.server;

  return {
    added_player,
    found_player
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
