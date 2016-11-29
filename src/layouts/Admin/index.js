import React, { Component } from 'react'
import { Nav, NavItem, Navbar } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'


export default class Admin extends Component {
  render() {
    const navbarInstance = (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href='/admin'>Панель Администратора</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to='/admin/addplayer'>
              <NavItem eventKey={1}>
                Добавить игрока
              </NavItem>
            </LinkContainer>
            <LinkContainer to='/admin/playerslist'>
              <NavItem eventKey={2}>Список игроков</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
    return (
      <div>
        { navbarInstance }
        {this.props.children}
      </div>
    )
  }
}