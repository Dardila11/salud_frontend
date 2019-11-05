import React, { Component } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import "./navbar.styles.css";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { URL } from "../../utils/URLSever";
import { closeSession } from "../../utils/handleLocalStorage";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogged: true
    };
  }

  logout = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const headers = {
      "Content-Type": "application/json",
      Authorization: "JWT " + token
    };
    axios
      .delete(URL + "/users/logout/", { headers: headers, data: {} })
      .then(() => {
        this.setState({ isLogged: false });
      });
  };

  render() {
    if (!this.state.isLogged) {
      return <Redirect to="/" />;
    }
    return (
      <Navbar expand="lg" className="h-100 color-custom">
        <Navbar.Brand href="#home">
          {" "}
          <div className="logo"></div>{" "}
        </Navbar.Brand>
        <Nav className="w-100 d-flex">
          <Button className="float-right btn-danger" onClick={this.logout}>
            Salir
          </Button>
        </Nav>
      </Navbar>
    );
  }
}

export default NavBar;
