import React, { Component } from "react";

import "./navAdmin.styles.css";
import { Nav, Tab } from "react-bootstrap";
import NavBar from "../../../layout/navbar/navbar.component";

import ListUsers from "../../../crud_users/listUsers/listUsers";
import { buttonToogle } from "../../../../js/sb-admin-2.min";
import "../../../../css/sb-admin-2.min.css";
import "../../../../vendor/fontawesome-free/css/all.min.css";
import "./css/fontello.css";

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
        onSelect={this.handleSelect}
      >
        <ul
          className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
          id="accordionSidebar"
        >
          <a
            className="sidebar-brand d-flex align-items-center justify-content-center"
            href="index.html"
          >
            <div className="sidebar-brand-icon">
              <i className="demo-icon icon-fa-salud"></i>
            </div>
            <div className="sidebar-brand-text mx-3 my-text">ClinDesign</div>
          </a>
          <hr className="sidebar-divider my-0"></hr>
          <li className="nav-item active">
            <a className="nav-link" href="index.html">
              <i className="fas fa-fw fa-tachometer-alt"></i>
              <span>Administrador</span>
            </a>
          </li>
          <hr className="sidebar-divider"></hr>
          <div className="sidebar-heading">Funciones</div>
          <li className="nav-item">
            <Nav.Link eventKey="1" name="1" role="button">
              <i className="fas fa-fw fa-users-cog"></i>
              <span>Usuarios</span>
            </Nav.Link>
          </li>
          <li className="nav-item">
            <Nav.Link className="nav-link" eventKey="2" name="2" role="button">
              <i className="fas fa-fw fa-notes-medical"></i>
              <span>Estudios</span>
            </Nav.Link>
          </li>
          <hr className="sidebar-divider"></hr>
          <div className="text-center d-none d-md-inline">
            <button
              className="rounded-circle border-0"
              id="sidebarToggle"
              onClick={buttonToogle}
            ></button>
          </div>
        </ul>
        <Tab.Content id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <NavBar></NavBar>
            <div className="container pt-2 pr-5 pl-5 pb-2">
              <Tab.Pane eventKey="1">
                <ListUsers />
              </Tab.Pane>
              <Tab.Pane eventKey="2"></Tab.Pane>
            </div>
          </div>
        </Tab.Content>
      </Tab.Container>
    );
  }
}

export default NavAdmin;
