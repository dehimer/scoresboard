import React, { Component } from 'react';
import { Button, CardContent, Card } from '@material-ui/core'
import PlayerForm from '../../../../components/PlayerForm'


export default class EditPlayer extends Component {
  requiredFields = ['nickname', 'fullname', 'birthday', 'city', 'phone', 'email'];

  state = {
    nickname: '',
    fullname: '',
    birthday: '',
    city: '',
    email: '',
    phone: '',
    notebook: '',
    link: '',
    broughtNotebook: false
  };

  handleClick() {
    const { register } = this.props;
    register({ ...this.state });
  }

  handleChange = name => event => {
    const value = (name === 'broughtNotebook') ? event.target.checked : event.target.value;

    this.setState({
      [name]: value
    });
  };

  componentDidMount() {
    console.log('componentDidMount');
    const { player } = this.props;
    const nextState = Object.keys(this.state).reduce((fields, fieldName) => {
      fields[fieldName] = fieldName === 'broughtNotebook' ? !!player[fieldName] : player[fieldName];

      return fields;
    }, {});
    console.log('nextState');
    console.log(nextState);

    this.setState(nextState);
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
  }

  render() {
    const disabled = Object.keys(this.state).some(fieldName => (this.requiredFields[fieldName] && !this.state[fieldName]));

    return (
      <Card>
        <CardContent>
          <form className='edit-player'>
            <PlayerForm onChangeHandler={::this.handleChange} player={this.state}/>

            <Button disabled={disabled} className='edit-player__input' onClick={::this.handleClick} variant='contained' color='primary'>
              Сохранить изменения
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }
}

