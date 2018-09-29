import React, { Component } from 'react';
import { connect } from 'react-redux'

import './index.scss'
import {Button, Card, CardContent, TextField} from '@material-ui/core';

class SetScores extends Component {
  state = {
    code: '',
    scores: 0
  };

  handleClick() {

  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    return (
      <div className='set-scores-wrapper'>
        <Card>
          <CardContent>
            <form className='set-scores'>
              <h3 className='set-scores__header'>Начисление баллов</h3>

              <TextField
                className='set-scores__input' type='text' label='ID'
                variant='outlined' margin='dense'
                value={this.state.code}
                onChange={this.handleChange('code')}
              />
              <TextField
                className='set-scores__input' type='number' label='Количество баллов'
                variant='outlined' margin='dense'
                value={this.state.scores}
                onChange={this.handleChange('scores')}
              />

              <div className='set-scores__spacer'/>

              <Button disabled={!this.state.code} className='set-scores__input' onClick={::this.handleClick}  variant='contained' color='primary'>
                Начислить
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = function (/*state*/) {
  // const {} = state.server;

  return {}
};

const mapDispatchToProps = (/*dispatch*/) => {
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetScores);
