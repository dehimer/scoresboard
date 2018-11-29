import React from 'react'
import { AppBar, Button, Toolbar } from '@material-ui/core';
import { Link } from 'react-router-dom'

export default (props) => {
  const {
    deletePlayers
  } = props;

  return (
    <AppBar position='static'>
      <Toolbar variant='dense'>
        <Button variant='contained' color='secondary' onClick={ deletePlayers } disabled={!deletePlayers}>
          Сбросить
        </Button>

        <Link to='/topten'>
          <Button variant='contained'>
            Топ 10
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  )
}
