import React, { Component } from "react";

import "./navAdmin.styles.css";
import { Row, Col, Nav, Tab, Container } from "react-bootstrap";

import ListUsers from "../../../crud_users/listUsers/listUsers";

class NavAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      tab: 1
    };
  }

  componentDidMount() {
    if (localStorage.getItem("user") != null) {
      this.setState({
        user: localStorage
          .getItem("user")
          .replace(/[""]+/g, "")
          .toLowerCase()
      });
    }
  }

  handleSelect = key => {
    this.setState({ tab: key });
  };
  render() {
    return (
      <Tab.Container
        id="left-tabs-example"
        activeKey={this.state.tab}
        onSelect={this.handleSelect}>
        <Row className="h-100 m-0">
          <Col sm={2} className="hf-100 p-0">
            <div
              className="h-100 navbar-nav sidebar sidebar-dark accordion"
              id="accordionSidebar">
              <Nav className="h-100 navadmin-custom">
                <ul>
                  <a className="sidebar-brand d-flex" href="/public/index.html">
                    <div className="sidebar-brand-text">
                      <span>{this.state.user}</span> <br />
                      <span>Universidad del Cauca</span>
                    </div>
                  </a>
                  {/* Opciones de navegacion */}
                  <Nav.Item>
                    <Nav.Link eventKey="1" name="1">
                      <div>
                        <span>Usuarios</span>
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="2" name="2">
                      <div>
                        <span>Proyectos</span>
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                </ul>
              </Nav>
            </div>
          </Col>
          <Col sm={10}>
            <Tab.Content>
              <Container className="pl-5 pr-5">
                <Tab.Pane eventKey="1">
                  <ListUsers />
                </Tab.Pane>
                <Tab.Pane eventKey="2"></Tab.Pane>
              </Container>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    );
  }
}

export default NavAdmin;
