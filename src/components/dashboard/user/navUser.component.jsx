import React, { Component } from "react";
import "../../../css/sb-admin-2.min.css";
import { Row, Col, Nav, Tab, Container } from "react-bootstrap";
import Forms from "../../forms/forms.component";

class NavUser extends Component {
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
      <Tab.Container
        id='left-tabs-example'
        activeKey={this.state.tab}
        onSelect={this.handleSelect}>
        <Row>
          <Col sm={3}>
            <div
              className='navbar-nav bg-gradient-primary sidebar sidebar-dark accordion'
              id='accordionSidebar'>
              <Nav>
                <a
                  className='sidebar-brand d-flex align-items-center justify-content-center'
                  href='/public/index.html'>
                  <div className='sidebar-brand-text mx-3'>
                    {this.state.user}
                  </div>
                </a>

                <hr className='sidebar-divider my-0' />

                {/* Opciones de navegacion */}
                <Nav.Item>
                  <Nav.Link eventKey='1' name='1'>
                    <li className='nav-item active'>
                      <div className='nav-link'>
                        <span>Mis proyectos</span>
                      </div>
                    </li>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='2' name='2'>
                    <li className='nav-item active'>
                      <div className='nav-link'>
                        <span>Eliminar Proyectos</span>
                      </div>
                    </li>
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <hr className='sidebar-divider' />
            </div>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Container className='pl-5 pr-5'>
                <Tab.Pane eventKey='1'>
                  <Forms />
                </Tab.Pane>
                <Tab.Pane eventKey='2'></Tab.Pane>
              </Container>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    );
  }
}

export default NavUser;
