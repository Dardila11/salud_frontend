import React, { Component } from "react";

import "../../../../css/sb-admin-2.min.css";
import "./navAdmin.component.css"
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
        user: localStorage.getItem("user").replace(/[""]+/g, "")
      });
    }
  }

  handleSelect = key => {
    this.setState({ tab: key });
  };
  render() {
    return (
      <Tab.Container class="p-0"
        id="left-tabs-example"
        activeKey={this.state.tab}
        onSelect={this.handleSelect}>
        <Row className="m-0 p-0">
          <Col sm={3}>
            <div
              className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
              id="accordionSidebar">
              <Nav>
                <a
                  className="sidebar-brand d-flex align-items-center justify-content-center"
                  href="/public/index.html">
                  <div className="sidebar-brand-text mx-3">
                    {this.state.user}
                  </div>
                </a>

                <hr className="sidebar-divider my-0" />

                {/* Opciones de navegacion */}
                <Nav.Item>
                  <Nav.Link eventKey="1" name="1" className="p-0">
                    <div className="nav-link">
                      <span>Usuarios</span>
                    </div>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="2" name="2" className="p-0">
                    <li className="nav-item ">
                      <div className="nav-link">
                        <span>Proyectos</span>
                      </div>
                    </li>
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <hr className="sidebar-divider" />
            </div>
          </Col>
          <Col sm={9}>
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
