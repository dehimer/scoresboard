import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Form, FormGroup, FormControl, Col, ControlLabel, ButtonGroup, Button, Alert } from 'react-bootstrap'

class AddPlayer extends Component {
  constructor(props) {

    super(props);
    this.state = {
      name: '',
      email: '',
      color: undefined,
      errors: []
    }
  }
  verify() {
    let errors = [];
    if(!this.state.name) {
      errors.push('Введите имя игрока');
    }
    if(!this.state.color) {
      errors.push('Выберите цвет');
    }
    this.setState({ errors: errors });
  }
  handleName(e){
    this.setState({name: e.target.value});
  }
  handleEmail(e) {
    this.setState({email: e.target.value});
  }
  handleColor(e) {
    this.setState({color: e.target.dataset.color});
  }
  onSubmit(e) {
    this.verify();
    e.preventDefault();
    return false;
  }
  render() {

    const colors = this.props.colors || [];

    let errors;
    if(this.state.errors.length){
      errors = (
        <Alert bsStyle='warning'>
          {
            this.state.errors.map((error, index) => (
              <div key={ index }><strong>Ошибка!</strong> {error}</div>
            ))
          }
        </Alert>
      )
    }

    return (
      <div>
        <br/>

        {errors}

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
                        backgroundColor: '#'+color,
                        width:'30px',
                        height:'30px',
                        margin: '2px'
                      };

                      return <Button
                        style={ styles }
                        key={ index }
                        data-color={color}
                        onClick={::this.handleColor}/>;
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

const mapDispatchToProps = (/*dispatch*/) => {
  return {
    // getColors: () => {
    //   dispatch(getColors())
    // }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPlayer);