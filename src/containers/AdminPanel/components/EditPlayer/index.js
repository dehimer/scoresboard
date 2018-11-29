import React, { Component } from 'react';
import { Button, CardContent, Card } from '@material-ui/core'
import PlayerForm from '../PlayerForm/index'

import './index.scss'

export default class EditPlayer extends Component {
  requiredFields = ['rfid', 'firstName', 'lastName', 'spend', 'balance', 'startBalance'];
  numericFields = ['rfid', 'spend', 'balance', 'startBalance'];

  state = {
    rfid: '',
    firstName: '',
    lastName: '',
    spend: '',
    balance: '',
    startBalance: ''
  };

  handleSave() {
    const { onUpdate } = this.props;
    const { ...data } = this.state;

    Object.keys(data).map(name => {
      if (this.numericFields.includes(name) ) {
        data[name] = data[name]*1;
      }
    });

    onUpdate({ ...data });
  }

  handleRemove() {
    const { onDelete } = this.props;

    onDelete({ ...this.state });
  }

  handleCancel() {
    const { onUpdate } = this.props;
    onUpdate();
  }

  handleChange = name => event => {
    const value = (name === 'broughtNotebook') ? event.target.checked : event.target.value;

    this.setState({
      [name]: value
    });
  };

  componentDidMount() {
    const { player } = this.props;
    const nextState = Object.keys(this.state).reduce((fields, fieldName) => {
      fields[fieldName] = player[fieldName] || '';

      return fields;
    }, {});

    this.setState(nextState);
  }

  render() {
    const disabled = Object.keys(this.state).some(fieldName => (this.requiredFields.includes(fieldName) && !this.state[fieldName]));

    return (
      <Card>
        <CardContent>
          <form className='edit-player'>
            <PlayerForm onChangeHandler={::this.handleChange} player={this.state} editMode={true}/>

            <div className='edit-player__controls'>
              <Button className='edit-player__input' onClick={::this.handleCancel} variant='contained'>
                Отмена
              </Button>
              <Button variant='contained' color='secondary' onClick={ ::this.handleRemove }>
                Удалить
              </Button>

              <Button disabled={disabled} className='edit-player__input' onClick={::this.handleSave} variant='contained' color='primary'>
                Сохранить изменения
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }
}

