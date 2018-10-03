import React from 'react'
import MenuBar from '../../components/MenuBar'
import {Button, Card, CardContent, TextField} from '@material-ui/core';

import './index.scss'

export default () => (
  <div>
    <MenuBar/>
    <div className='import-csv-wrapper'>
      <Card>
        <CardContent>
          <form className='import-csv'>
            <h3 className='import-csv__header'>Импорт CSV</h3>

            <TextField
              className='import-csv__input' type='file'
              variant='outlined' margin='dense'
            />

            <div className='import-csv__spacer'/>

            <Button className='import-csv__input' variant='contained' color='primary'>
              Импорт
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
)
