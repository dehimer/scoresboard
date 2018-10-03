import React from 'react'
import { AppBar, Button, Toolbar } from '@material-ui/core';

export default (props) => {
  const {
    resetScores
  } = props;

  return (
    <AppBar position='static'>
      <Toolbar variant='dense'>
        <Button variant='contained' color='secondary' onClick={ resetScores }>
          Сбросить баллы
        </Button>
      </Toolbar>
    </AppBar>
  )
}
