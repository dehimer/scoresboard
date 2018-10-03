import React from 'react'
import { AppBar, Button, Toolbar } from '@material-ui/core';
import { Link } from 'react-router-dom'

export default (props) => {
  const {
    resetScores
  } = props;

  return (
    <AppBar position='static'>
      <Toolbar variant='dense'>
        <Link to='/adminpanel'>
          <Button variant='contained'>
            Панель администратора
          </Button>
        </Link>

        <Button variant='contained' color='secondary' onClick={ resetScores } disabled={!resetScores}>
          Сбросить баллы
        </Button>

        <Link to='/import-csv'>
          <Button variant='contained'>
            Импорт CSV
          </Button>
        </Link>

        <Link to='/game'>
          <Button variant='contained'>
            Начислить баллы
          </Button>
        </Link>
        <Link to='/settournament'>
          <Button variant='contained'>
            Задать номер турнира
          </Button>
        </Link>
        <Link to='/table'>
          <Button variant='contained'>
             Топ 10
          </Button>
        </Link>

        <Link to='/table-full'>
          <Button variant='contained'>
            Топ Всех
          </Button>
        </Link>

        <Link to='/registration'>
          <Button variant='contained'>
            Регистрация
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  )
}
