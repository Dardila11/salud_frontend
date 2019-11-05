import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import "./navbar.styles.css";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Navbar expand="lg" className="h-100 color-custom">
        <Navbar.Brand href="#home">
          {" "}
          <div className="logo"></div>{" "}
        </Navbar.Brand>
        <Nav className="mr-auto"></Nav>
      </Navbar>
    );
  }
}

export default NavBar;
