import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Table, Button, Modal } from 'react-bootstrap'

import TimeFormat from 'hh-mm-ss'

class PlayersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waitacceptclear: false
    }
  }
  componentWillMount() {
    this.props.syncAllPlayers();
  }
  handleAcceptClear(clear) {
    if(clear){
      this.props.removeAllPlayers();
    }

    this.setState({waitacceptclear:false});
  }
  showtable(){

    const players = this.props.players || [];

    if(players.length){
      return (<Grid>
        <Row className='show-grid'>
          <Col>
            <Button bsStyle='danger'
              onClick={ () => (this.setState({waitacceptclear:true})) }>
              Удалить всех
            </Button>
          </Col>
        </Row>
        <br/>
        <Row className='show-grid'>
          <Col>
            <Table responsive>
              <thead>
                <tr>
                  <th>Номер</th>
                  <th>Имя</th>
                  <th>Контакты</th>
                  <th>Время</th>
                  <th>Баллы</th>
                </tr>
              </thead>
              <tbody>
                {
                  players.map((player, index) => {
                    const time = +player.time >0 ? TimeFormat.fromS(+player.time) : '-';
                    return (
                      <tr key={ index }>
                        <th>{ player.num }</th>
                        <th>{ player.name }</th>
                        <th>{ player.contact || '-' }</th>
                        <th>{ time }</th>
                        <th>{ player.scores }</th>
                      </tr>)
                  })
                  
                }
              </tbody>
            </Table>
          </Col>
        </Row>
      </Grid>)
    }else{
      return (<Grid>
        <Row className='show-grid'>
          <Col>
            Список игроков пуст
          </Col>
        </Row>
      </Grid>)
    }
  }
  render() {

    let showacceptclear;
    if(this.state.waitacceptclear){
      showacceptclear = (<div className='static-modal'>
        <Modal.Dialog bsSize='small'>

          <Modal.Body>
            Все игроки будут удалены.
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={ () => {this.handleAcceptClear(false)} }>Отмена</Button>
            <Button bsStyle='primary' onClick={ () => {this.handleAcceptClear(true)} }>
              Подтвердить удаление
            </Button>
          </Modal.Footer>

        </Modal.Dialog>
      </div>)
    }

    return (
      <div>
        { showacceptclear }
        { this.showtable() }
      </div>
    )
  }
}

const mapStateToProps = function (state) {
  return {
    players: state.server.all_players,
    colorsById: state.server.colorsById
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    syncAllPlayers: () => {
      dispatch({type:'server/all_players'});
    },
    removeAllPlayers: () => {
      dispatch({type:'server/clear'});
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayersList);