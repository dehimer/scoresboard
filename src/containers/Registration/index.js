import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'

import './index.scss'
import { Button, Card, CardContent, TextField, Typography } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    fontSize: 100
  }
});

class Registration extends Component {
  state = {
    player: {
      firstName: '',
      lastName: ''
    },
    rfidWaiting: false
  };

  register() {
    const { addPlayer, match: { params: { tabletId } } } = this.props;
    const { player } = this.state;

    addPlayer({ ...player, tabletId });

    this.setState({
      rfidWaiting: true
    })
  }

  handleChange = name => event => {
    const value = event.target.value;
    const { player } = this.state;

    this.setState({
      player: { ...player, [name]: value }
    });
  };

  render() {
    const { player, rfidWaiting } = this.state;
    const { firstName, lastName } = player;

    return (
      <div className='registration'>
        <Card>
          <CardContent>
            {
              rfidWaiting ? (
                <Typography color='textSecondary' variant='display4'>
                  Поднесите карту к считывателю
                </Typography>
              ) : (
                <Fragment>
                  <Typography color='textSecondary' variant='display2'>
                    Регистрация
                  </Typography>
                  <form>
                    <MuiThemeProvider theme={theme}>
                      <TextField
                        type='text' placeholder='Имя'
                        variant='outlined' margin='dense'
                        value={ firstName }
                        onChange={ this.handleChange('firstName') }
                      />
                      <TextField
                        type='text' placeholder='Фамилия'
                        variant='outlined' margin='dense'
                        value={ lastName }
                        onChange={ this.handleChange('lastName') }
                      />

                      <br/>

                      <Button disabled={!firstName || !lastName} onClick={::this.register} variant='contained' color='primary'>
                        Зарегистрироваться
                      </Button>
                    </MuiThemeProvider>
                  </form>
                </Fragment>
              )
            }
          </CardContent>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  const { added_player } = state.server;

  return { added_player }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addPlayer: (player) => {
      dispatch({ type: 'server/add_player', data: player });
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Registration);
