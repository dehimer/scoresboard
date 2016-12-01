import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Form, FormGroup, FormControl, Col, ControlLabel, ButtonGroup, Button, Alert } from 'react-bootstrap'
import classNames from 'classnames'

import './styles.scss'


class AddPlayer extends Component {
  constructor(props) {

    super(props);
    this.state = {
      name: '',
      email: '',
      colorId: 0,
      errors: []
    }
  }
  verify(cb) {
    let errors = [];
    if(!this.state.name) {
      errors.push('Введите имя игрока');
    }
    if(!this.state.colorId) {
      errors.push('Выберите цвет');
    }
    this.setState({ errors: errors });
    cb && cb(errors.length > 0);
  }
  handleName(e){
    this.setState({name: e.target.value});
  }
  handleEmail(e) {
    this.setState({email: e.target.value});
  }
  handleColorId(e) {
    this.setState({colorId: e.target.dataset.color_id});
  }
  onSubmit(e) {
    this.verify( err => {
      if(!err){
        const { name, email, colorId} = this.state;
        this.props.addPlayer({
          name, email, colorId
        });
        this.setState({
          name: '',
          email: '',
          colorId: 0
        })
      }
    });
    e.preventDefault();
    return false;
  }
  render() {

    const colors = this.props.colors || [];

    let errors = [].concat(this.state.errors);
    let showerrors;
    if(!colors.length){
      errors.unshift('Все цвета заняты');
    }
    if(errors.length){
      showerrors = (
        <Alert bsStyle='warning'>
          {
            errors.map((error, index) => (
              <div key={ index }><strong>Ошибка!</strong> {error}</div>
            ))
          }
        </Alert>
      )
    }

    console.log(colors);

    return (
      <div>
        <br/>

        {showerrors}

        <Grid>
        
        <Row className='show-grid'>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4}>
            <Form horizontal>
              <FormGroup controlId='formHorizontalName'>
                <Col componentClass={ControlLabel} sm={2}>
                  Имя
                </Col>
                <Col sm={10}>
                  <FormControl
                    type='text'
                    placeholder='Имя'
                    value={this.state.name}
                    onChange={::this.handleName}/>
                </Col>
              </FormGroup>

              <FormGroup controlId='formHorizontalEmail'>
                <Col componentClass={ControlLabel} sm={2}>
                  Email
                </Col>
                <Col sm={10}>
                  <FormControl
                    type='email'
                    placeholder='Email'
                    value={this.state.email}
                    onChange={::this.handleEmail}/>
                </Col>
              </FormGroup>


              <FormGroup>
                <Col componentClass={ControlLabel} sm={2}>
                  Цвет
                </Col>
                <Col smOffset={2} sm={10}>
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
                <Col smOffset={2} sm={10}>
                  <Button type='submit' onClick={::this.onSubmit}>
                    Добавить
                  </Button>
                </Col>
              </FormGroup>
            </Form>
            
          </Col>
          <Col xhidden md={4}></Col>
        </Row>

      </Grid>

      </div>
    )
  }
}

const mapStateToProps = function (state) {
  return {
    colors: state.server.colors
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addPlayer: (player) => {
      dispatch({type:'server/add_player', data:player});
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPlayer);