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
          <Form inline>
            <FormControl type='text' placeholder='Search' className='mr-sm-2' />
            <Button variant='outline-info'>Search</Button>
          </Form>
        </Navbar>
        {/* <nav class='navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow'></nav> */}
      </div>
    );
  }
}

export default NavBar;
