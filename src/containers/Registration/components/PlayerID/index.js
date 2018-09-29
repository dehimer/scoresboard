import {Button, Card, CardContent, Typography} from '@material-ui/core'
import React from 'react';

export default ({ player, cleanupPlayer}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant='display4' gutterBottom>
          ID: { player.code }
        </Typography>

        <Typography variant='display1' gutterBottom>
          Никнейм: { player.nickname }
        </Typography>

        <Typography variant='display1' gutterBottom>
          Email: { player.email }
        </Typography>

        <Typography variant='display1' gutterBottom>
          Ноутбук: { player.notebook }
        </Typography>

        <Button className='new-player__input' onClick={cleanupPlayer} variant='contained'>
          Назад
        </Button>
      </CardContent>
    </Card>
  )
}

