import React, { Component } from 'react';
import { connect } from 'react-redux'

import './index.scss'
import { Button, Card, CardContent, TextField, Typography } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    fontSize: 50
  }
});

class Registration extends Component {
  state = {
    player: {
      firstName: '',
      lastName: ''
    }
  };

  register() {
    this.props.addPlayer(this.state.player);
  }

  handleChange = name => event => {
    const value = event.target.value;

    this.setState({
      [name]: value
    });
  };

  render() {
    const { firstName, lastName } = this.state;

    return (
      <div className='registration'>
        <Card>
          <CardContent>
            <Typography color='textSecondary' variant='headline'>
              Регистрация
            </Typography>
            <form>
              <MuiThemeProvider theme={theme}>
                <TextField
                  type='text' label='Имя'
                  variant='outlined' margin='dense'
                  value={ firstName }
                  onChange={ this.handleChange('firstName') }
                />
                <TextField
                  type='text' label='Фамилия'
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
