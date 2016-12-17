import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Form, FormGroup, FormControl, Col, ControlLabel, ButtonGroup, Button, Alert, Table } from 'react-bootstrap'
import classNames from 'classnames'

import './styles.scss'


class AddPlayer extends Component {
  constructor(props) {

    super(props);
    this.state = {
      name: '',
      contact: '',
      colorId: 0,
      errors: []
    }
  }
  componentWillMount() {
    this.props.syncFreeColors();
    this.props.syncActivePlayers();
  }
  verify(cb) {
    let errors = [];
    if(!this.state.name) {
      errors.push('Введите имя игрока');
    }
    if(this.state.colorId === 0) {
      errors.push('Выберите цвет');
    }
    this.setState({ errors: errors });
    cb && cb(errors.length > 0);
  }
  handleName(e){
    this.setState({name: e.target.value});
  }
  handleContact(e) {
    this.setState({contact: e.target.value});
  }
  handleColorId(e) {
    this.setState({colorId: +e.target.dataset.color_id});
  }
  onSubmit(e) {
    this.verify( err => {
      if(!err){
        const { name, contact, colorId} = this.state;
        this.props.addPlayer({
          name, contact, colorId
        });
        this.setState({
          name: '',
          contact: '',
          colorId: 0
        })
      }
    });
    e.preventDefault();
    return false;
  }
  removePlayer(e) {
    this.props.removePlayer(+e.target.dataset.num);
  }
  render() {

    const players = this.props.players;
    const colors = this.props.colors;

    let errors = [].concat(this.state.errors);
    let showerrors;
    if(!colors.length){
      errors.unshift('Все цвета заняты.');
    }
    if(errors.length){
      showerrors = (<Row className='show-grid'>
        <Col md={1}></Col>
        <Col md={10}>
          <Alert bsStyle='warning'>
            {
              errors.map((error, index) => (
                <div key={ index }><strong>Ошибка!</strong> {error}</div>
              ))
            }
          </Alert>
        </Col>
        <Col md={1}></Col>
      </Row>)
    }

    let showplayers;
    if(players.length){
      showplayers = (<Row className='show-grid'>
        <Col md={1} sm={1}></Col>
        <Col md={10} sm={10}>
          <h2>Активные игроки</h2>
          <Table responsive>
            <thead>
              <tr>
                <th>Цвет</th>
                <th>Номер</th>
                <th>Имя</th>
                <th>Контакты</th>
                <th>Баллы</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {
                players.map((player, index) => {
                  return (<tr key={ index }>
                    <th><div style={{backgroundColor:'#'+this.props.colorsById[player.colorId].code, width:'20px', height:'20px'}}></div></th>
                    <th>{ player.num }</th>
                    <th>{ player.name }</th>
                    <th>{ player.contact }</th>
                    <th>{ player.scores }</th>
                    <th>
                      <Button
                        data-num={ player.num }
                        onClick={ ::this.removePlayer }>
                          Удалить
                      </Button>
                    </th>
                  </tr>)
                })
              }
            </tbody>
          </Table>
        </Col>
        <Col md={1} sm={1}></Col>
      </Row>)
    }

    let showaddform;
    if(colors.length){
      showaddform = (<Row className='show-grid'>
        <Col md={3} sm={3} xs={2}></Col>
        <Col md={4} sm={6} xs={8}>
          <h3>Добавить игрока</h3>
          <Form horizontal>
            <FormGroup controlId='formHorizontalName'>
              <Col componentClass={ControlLabel} sm={3}>
                Имя
              </Col>
              <Col sm={9}>
                <FormControl
                  type='text'
                  placeholder='Имя'
                  value={this.state.name}
                  onChange={::this.handleName}/>
              </Col>
            </FormGroup>

            <FormGroup controlId='formHorizontalContact'>
              <Col componentClass={ControlLabel} sm={3}>
                Контакты
              </Col>
              <Col sm={9}>
                <FormControl
                  type='text'
                  placeholder='Контакты'
                  value={this.state.contact}
                  onChange={::this.handleContact}/>
              </Col>
            </FormGroup>


            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Цвет
              </Col>
              <Col sm={9}>
                <ButtonGroup>
                {
                  colors.map((color, index) => {

                    const styles = {
                      backgroundColor: '#'+color.code,
                      width:'30px',
                      height:'30px',
                      margin: '2px'
                    };

                    return <Button
                      className={classNames({'add-player__color--selected':+this.state.colorId === +color.id})}
                      style={ styles }
                      key={ index }
                      data-color_id={color.id}
                      onClick={::this.handleColorId}/>;
                  })
                }
                </ButtonGroup>
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={3} sm={9}>
                <Button type='submit' onClick={::this.onSubmit}>
                  Добавить
                </Button>
              </Col>
            </FormGroup>
          </Form>
          
        </Col>
        <Col md={3} sm={3} xs={2}></Col>
      </Row>)
    }

    return (
      <div>
        <Grid>
          {showerrors}
          {showplayers}          
          {showaddform}
        </Grid>

      </div>
    )
  }
}

const mapStateToProps = function (state) {
  return {
    colors: state.server.free_colors,
    colorsById: state.server.colorsById,
    players: state.server.active_players
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addPlayer: (player) => {
      dispatch({type:'server/add_player', data:player});
    },
    syncFreeColors: () => {
      dispatch({type:'server/free_colors'});
    },
    syncActivePlayers: () => {
      dispatch({type:'server/active_players'});
    },
    removePlayer: playerNum => {
      dispatch({type:'server/remove_player', data:playerNum});
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPlayer);