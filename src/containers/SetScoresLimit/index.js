import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, Card, CardContent, TextField, Snackbar } from '@material-ui/core';

import './index.scss'
import MenuBar from '../../components/MenuBar';

class SetScoresLimit extends Component {
  state = {
    inputTouched: false,
    scoresLimit: 0,
    showSnackbar: false
  };

  handleCloseSnackbar() {
    this.setState({
      showSnackbar: false
    })
  }

  handleClick() {
    const { setScoresLimit } = this.props;
    const { scoresLimit } = this.state;
    setScoresLimit(scoresLimit);
  }

  handleChange(event) {
    const value = event.target.value * 1;
    this.setState({
      inputTouched: true,
      scoresLimit: value
    });
  }

  componentWillReceiveProps(nextProps) {
    const { scores_limit: scores_limit_prev } = this.props;
    const { scores_limit: scores_limit_next } = nextProps;
    const scores_limit_changed = !isNaN(+scores_limit_next) && scores_limit_next !== scores_limit_prev;

    if (scores_limit_changed) {
      this.setState({
        showSnackbar: this.state.inputTouched,
        scoresLimit: scores_limit_next
      })
    }
  }

  componentDidMount() {
    const { scores_limit } = this.props;
    if (typeof scores_limit !== 'undefined'){
      this.setState({
        scoresLimit: scores_limit
      })
    } else {
      this.props.getScoresLimit();
    }
  }

  render() {
    const { inputTouched, scoresLimit } = this.state;

    return (
      <div>
        <MenuBar/>
        <div className='set-scores-limit-wrapper'>
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
            open={this.state.showSnackbar}
            autoHideDuration={6000}
            onClose={::this.handleCloseSnackbar}
            ContentProps={{
              'aria-describedby': 'message-id'
            }}
            message={<span id='message-id'>Лимит баллов успешно обновлён</span>}
          />
          <Card>
            <CardContent>
              <form className='set-scores-limit'>
                <h3 className='set-scores-limit__header'>Установка лимита баллов</h3>

                <TextField
                  className='set-scores-limit__input' type='text' label='Лимит баллов'
                  variant='outlined' margin='dense'
                  value={ scoresLimit }
                  onChange={ ::this.handleChange }
                />

                <div className='set-scores-limit__spacer'/>

                <Button disabled={!inputTouched || !scoresLimit || scoresLimit === this.props.scores_limit} className='set-scores-limit__input' onClick={::this.handleClick}  variant='contained' color='primary'>
                  Установить
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  const { scores_limit } = state.server;

  return {
    scores_limit
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setScoresLimit: (scoresLimit) => {
      dispatch({ type: 'server/set_scores_limit', data: scoresLimit });
    },
    getScoresLimit: () => {
      dispatch({ type: 'server/get_scores_limit' });
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetScoresLimit);
