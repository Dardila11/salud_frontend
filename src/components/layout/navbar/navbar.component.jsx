import React, { Component } from "react";
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Navbar bg='light' expand='lg'>
          <Navbar.Brand href='#home'>ClinDesign</Navbar.Brand>
          <Nav className='mr-auto'></Nav>
        </Navbar>
      </div>
    );
  }
}

export default NavBar;
