import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Form, FormGroup, FormControl, Col, ControlLabel, Button } from 'react-bootstrap'

class AddPlayer extends Component {
  constructor(props) {

    super(props);

    this.state = {
      name: '',
      email: '',
      color: undefined
    }
  }
  handleName(e){
    this.setState({name: e.target.value});
  }
  handleEmail(e) {
    this.setState({email: e.target.value});
  }
  onSubmit() {
    console.log(this.state)
  }
  render() {
    return (
      <div>
        <br/>

        <Grid>
        
        <Row className='show-grid'>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4}>
            <Form horizontal onSubmit={this.onSubmit}>
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
                <Col smOffset={2} sm={10}>

                </Col>
              </FormGroup>

              <FormGroup>
                <Col smOffset={2} sm={10}>
                  <Button type='submit'>
                    Добавить
                  </Button>
                </Col>
              </FormGroup>
            </Form>
            
          </Col>
          <Col xsHidden md={4}></Col>
        </Row>

      </Grid>

      </div>
    )
  }
}

const mapStateToProps = function (/*state*/) {
  return {
    // colors: state.colors
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