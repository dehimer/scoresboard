import React from 'react';
import { Button, Dialog, DialogContent, DialogActions, Typography } from '@material-ui/core';

import './index.scss'

export default ({ handleCancel, handleConfirm }) => (
  <Dialog
    open={true}
    disableBackdropClick
    disableEscapeKeyDown

    aria-labelledby='confirmation-dialog-title'
  >
    <DialogContent>
      <Typography variant='display1' gutterBottom>
        Подтвердите сброс баллов
      </Typography>
      <Typography variant='headline' gutterBottom>
        Баллы будут сброшены у всех участников!
      </Typography>
    </DialogContent>
    <DialogActions>
      <div className='reset-scores-dialog__controls'>
        <Button onClick={ handleCancel } variant='contained'>
          Отменить
        </Button>
        <Button onClick={ handleConfirm } variant='contained' color='secondary'>
          Подтвердить
        </Button>
      </div>
    </DialogActions>
  </Dialog>
)
