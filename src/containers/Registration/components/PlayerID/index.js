import {Button, Card, CardContent, Typography} from '@material-ui/core'
import React from 'react';

import './index.scss'

export default ({ player, cleanupPlayer}) => {
  return (
    <Card>
      <CardContent>
        {
          player.code > 0 ? (
            <React.Fragment>
              <Typography variant='display4' gutterBottom>
                ID: <b>{ player.code }</b>
              </Typography>

              <Typography variant='display1' gutterBottom>
                Никнейм: <b>{ player.nickname }</b>
              </Typography>

              <Typography variant='display1' gutterBottom>
                Email: <b>{ player.email }</b>
              </Typography>

              <Typography variant='display1' gutterBottom>
                Ноутбук: <b>{ player.notebook }</b>
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Typography variant='display3' gutterBottom>
                Пользователь не найден
              </Typography>

              <Typography variant='display1' gutterBottom>
                Email: <b>{ player.email }</b>
              </Typography>
            </React.Fragment>
          )
        }

        <Button className='player-id__button' onClick={cleanupPlayer} variant='contained'>
          Назад
        </Button>
      </CardContent>
    </Card>
  )
}

