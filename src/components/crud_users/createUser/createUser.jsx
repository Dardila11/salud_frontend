import React, { Component } from "react";
import axios from "axios";
import { URL } from "../../utils/URLSever";
import { Button, Modal, Form, Col } from "react-bootstrap";

// TODO
// - Arreglar las accioens de mostrar y esconder del modal apropiadamente. los botones deben ir en este archivo
// - Agregar el formulario para crear nuevos usuarios
// - Implementar la peticion al API para crear nuevos usuarios
class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: -1,
      userId: "",
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confEmail: "",
      myCenter: -1,
      myDepartment: -1,
      infoCenters: [],
      infoDepartaments: [],
      show: false,
      setShow: false,
      validated: false,
      setValidated: false
    };
  }

  handleClose = () => {
    this.props.handleClose();
  };

  handleCloseCreate = () => {
    this.props.handleCloseCreate();
  };

  componentDidMount() {
    this.loadCenters();
    this.loadDepartaments();
  }

  loadCenters = async () => {
    var token = localStorage.getItem("token").replace(/[""]+/g, "");
    axios
      .get(URL + "/places/center/all/", {
        headers: {
          Authorization: "JWT " + token
        }
      })
      .then(response => {
        this.setState({ infoCenters: response.data }, () => {
          console.log(this.state.infoCenters);
        });
      });
  };

  loadDepartaments = async () => {
    var token = localStorage.getItem("token").replace(/[""]+/g, "");
    axios
      .get(URL + "/places/department/all/", {
        headers: {
          Authorization: "JWT " + token
        }
      })
      .then(response => {
        this.setState({ infoDepartaments: response.data }, () => {
          console.log(this.state.infoDepartaments);
        });
      });
  };

  saveNewUserInfo = async () => {
    var token = localStorage.getItem("token").replace(/[""]+/g, "");
    const {
      type,
      userId,
      firstName,
      lastName,
      email,
      myCenter,
      myDepartment
    } = this.state;
    var json = {
      user: {
        type: type,
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        my_center: myCenter,
        my_department: myDepartment
      },
      permissions: [{ name: "add_user" }, { name: "change_user" }]
    };

    console.log(json);
    const headers = {
      "Content-Type": "application/json",
      Authorization: "JWT " + token
    };

    axios
      .post(URL + "/users/", json, {
        headers: headers
      })
      .then(response => {
        //console.log(response.status);
      })
      .catch(error => {
        console.log("oh no, hubo un error!");
        console.warn(error.status);
      });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
    this.saveNewUserInfo();
    // const form = event.currentTarget;
    // if (form.checkValidity() === false) {

    //   event.stopPropagation();
    // }
    // this.setState({ setValidated: true });
  };
  handleClose = () => {
    this.setState({ setShow: false });
  };

  handleShow = () => {
    this.setState({ setShow: true });
  };
  render() {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Crear Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={this.handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="formGridState">
                <Form.Label>Tipo</Form.Label>
                <Form.Control
                  as="select"
                  name="type"
                  value={this.state.type}
                  onChange={this.handleChange}>
                  <option>...</option>
                  <option value="1">Administrador</option>
                  <option value="2">Usuario Simple</option>
                </Form.Control>
                <Form.Control.Feedback>Correcto!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <Form.Label>Identificación</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="userId"
                  placeholder="Identificación"
                  value={this.state.userId}
                  onChange={this.handleChange}
                />
                <Form.Control.Feedback>Correcto!</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <Form.Label>Nombres</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="firstName"
                  placeholder="Nombres"
                  value={this.state.firstName}
                  onChange={this.handleChange}
                />
                <Form.Control.Feedback>Correcto!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom02">
                <Form.Label>Apellidos</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="lastName"
                  placeholder="Apellidos"
                  value={this.state.lastName}
                  onChange={this.handleChange}
                />
                <Form.Control.Feedback>Correcto!</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="validationCustomUsername">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Porfavor digite un correo valido
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="validationCustomUsername">
                <Form.Label>Confirmar Correo</Form.Label>
                <Form.Control
                  name="confEmail"
                  type="email"
                  placeholder="email"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Correo no coincide
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="validationCustom03">
                <Form.Label>Centro</Form.Label>
                <Form.Control
                  as="select"
                  name="myCenter"
                  value={this.state.myCenter}
                  onChange={this.handleChange}>
                  <option>...</option>
                  <option value="1">Psicologia</option>
                  <option value="2">Otro</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Porfavor, elija un centro
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom04">
                <Form.Label>Departamento</Form.Label>
                <Form.Control
                  as="select"
                  name="myDepartment"
                  value={this.state.myDepartment}
                  onChange={this.handleChange}>
                  <option>...</option>
                  <option value="1">Salud</option>
                  <option value="2">Otro</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Porfavor, elija un departamento
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Button type="submit">Crear Usuario</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleCloseCreate}>
            Cancelar
          </Button>
          {/* <Button variant="primary" onClick={this.handleClose}>
            Save Changes
          </Button> */}
        </Modal.Footer>
      </>
    );
  }
}

export default CreateUser;
