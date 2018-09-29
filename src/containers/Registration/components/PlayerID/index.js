import {Button, Card, CardContent, Typography} from '@material-ui/core'
import React from 'react';

export default ({ player, cleanupPlayer}) => {
  return (
    <Card>
      <CardContent>
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

        <Button className='new-player__input' onClick={cleanupPlayer} variant='contained'>
          Назад
        </Button>
      </CardContent>
    </Card>
  )
}

