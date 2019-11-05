import React, { Component } from "react";
import axios from "axios";
import { URL } from "../../utils/URLSever";
import { Button, Modal, Form, Col } from "react-bootstrap";

// TODO:
// - Asignar correctamente el centro y departamento. el api retorna el nombre, pero necesitamos el id
//   debemos crear un metodo para poder asignarlo correctamente
// - Si el usuario no tiene asignado ningun centro ni departamento, se debe poder dejarlo en blanco. sin errores
// - adicionar la logica de comparacion de los cambios email
// - validacion de formulario
class UpdateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailToEdit: props.email,
      type: "",
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confEmail: "",
      myCenter: "",
      myDepartment: "",
      infoCenters: [],
      optionsCenters: [],
      optionsDepartments: [],
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

  handleCloseUpdate = () => {
    this.props.handleCloseUpdate();
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount() {
    this.loadCenters();
    this.loadDepartaments();
    this.getUserByEmail();
  }

  viewCentersInfo = () => {
    console.log(this.state.infoCenters);
    var optionsCentersArray = [];
    for (let index = 0; index < this.state.infoCenters.length; index++) {
      var name = this.state.infoCenters[index].fields.name;
      var pk = this.state.infoCenters[index].pk;
      optionsCentersArray.push({ myPk: pk, myName: name });
    }
    this.setState({ optionsCenters: optionsCentersArray });
  };

  loadCenters = async () => {
    var token = localStorage.getItem("token").replace(/[""]+/g, "");
    await axios
      .get(URL + "/places/center/all/", {
        headers: {
          Authorization: "JWT " + token
        }
      })
      .then(response => {
        this.setState({ infoCenters: response.data }, () => {
          this.viewCentersInfo();
        });
      });
  };

  loadDepartaments = async () => {
    var token = localStorage.getItem("token").replace(/[""]+/g, "");
    await axios
      .get(URL + "/places/department/all/", {
        headers: {
          Authorization: "JWT " + token
        }
      })
      .then(response => {
        this.setState({ infoDepartaments: response.data }, () => {
          this.viewDepartmentsInfo();
        });
      });
  };

  viewDepartmentsInfo = () => {
    console.log(this.state.infoDepartaments);
    var optionsDepArray = [];
    for (let index = 0; index < this.state.infoDepartaments.length; index++) {
      var name = this.state.infoDepartaments[index].fields.name;
      var pk = this.state.infoDepartaments[index].pk;
      optionsDepArray.push({ myPk: pk, myName: name });
    }
    this.setState({ optionsDepartments: optionsDepArray });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.updateUserInfo();
  };

  updateUserInfo = () => {
    var token = localStorage.getItem("token").replace(/[""]+/g, "");
    const {
      type,
      firstName,
      lastName,
      email,
      myCenter,
      myDepartment
    } = this.state;
    var json = {
      email_instance: this.state.emailToEdit,
      user: {
        type: type,
        first_name: firstName,
        last_name: lastName,
        email: email,
        my_center: myCenter,
        my_department: myDepartment
      },
      permissions_add: [{ name: "add_user" }, { name: "change_user" }],
      permissions_remove: []
    };
    var myJson = JSON.stringify(json);
    console.log("LO QUE SE ESTÄ GUARDANDO " + myJson);
    const headers = {
      "Content-Type": "application/json",
      Authorization: "JWT " + token
    };

    axios
      .put(URL + "/users/", json, {
        headers: headers
      })
      .then(response => {
        console.log(response.status);
        this.handleCloseUpdate();
      });
  };

  getUserByEmail = () => {
    var token = localStorage.getItem("token").replace(/[""]+/g, "");
    const headers = {
      "Content-Type": "application/json",
      Authorization: "JWT " + token
    };
    axios
      .get(URL + "/users/" + this.state.emailToEdit, {
        headers: headers
      })
      .then(response => {
        let role;
        role = response.data[0].is_staff === true ? (role = "1") : (role = "2");
        this.setState(
          {
            firstName: response.data[0].first_name,
            lastName: response.data[0].last_name,
            email: response.data[0].email,
            type: role,
            myCenter: response.data[0].my_center,
            myDepartment: response.data[0].my_department
          },
          () => {
            //console.log(this.state.type);
            console.log("Ha sido asignado el centro: " + this.state.myCenter);
          }
        );
      });
  };
  render() {
    return (
      <>
        {/* <h2>{this.props.email}</h2> */}
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            id="formUpdate"
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
                  <option key={-1} value={-1}>
                    ...
                  </option>
                  <option key={1} value={1}>
                    Administrador
                  </option>
                  <option key={2} value={2}>
                    Usuario Simple
                  </option>
                </Form.Control>
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
                  defaultValue={this.state.firstName}
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
                  defaultValue={this.state.lastName}
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
                  defaultValue={this.state.email}
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
                  {this.state.optionsCenters.map((option, index) => {
                    return (
                      <option key={index} value={option.myPk}>
                        {option.myName}
                      </option>
                    );
                  })}
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
                  {this.state.optionsDepartments.map((option, index) => {
                    return (
                      <option key={index} value={option.myPk}>
                        {option.myName}
                      </option>
                    );
                  })}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Porfavor, elija un departamento
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Cancelar
          </Button>
          <Button form="formUpdate" type="submit">
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </>
    );
  }
}

export default UpdateUser;
