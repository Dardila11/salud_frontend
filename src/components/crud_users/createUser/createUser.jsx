import React, { Component } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { URL } from '../../utils/URLSever';
import { Button, Modal, Form, Col, Alert } from 'react-bootstrap';

/** NO BORRAR ESTE COMPONENTE
 * @author Dardila
 * @description Este componente se encarga de la creación de un usuario nuevo en la plataforma.
 * Se llena un formulario con los datos del usuario a crear ( Id, firstName, lastName, Email,
 * Center, Department and Permissions)
 */
class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: -1,
      userId: '',
      firstName: '',
      lastName: '',
      email: '',
      confEmail: '',
      myCenter: -1,
      myDepartment: -1,
      createCenters: false,
      createUsers: false,
      createProjects: false,
      infoCenters: [],
      optionsCenters: [],
      optionsDepartments: [],
      myInfoCenters: [],
      infoDepartaments: [],
      show: false,
      setShow: false,
      validated: false,
      setValidated: false,
      emailValidated: false
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
    console.log('se ejecuta loadCenters');
    const token = JSON.parse(localStorage.getItem('token'));
    axios
      .get(URL + '/places/center/all/', {
        headers: {
          Authorization: 'JWT ' + token
        }
      })
      .catch(err=>{
      alert(err.response.data)
      }
      )
      .then(response => {
        alert(response.data)
      });
  };

  viewCentersInfo = () => {
    console.log(this.state.infoCenters);
    var optionsCentersArray = [];
    // recorremos todo los centros y sacamos el nombre y el id
    for (let index = 0; index < this.state.infoCenters.length; index++) {
      var name = this.state.infoCenters[index].fields.name;
      var pk = this.state.infoCenters[index].pk;
      console.log('Nombre del centro: ' + name + ' pk: ' + pk);
      optionsCentersArray.push({ myPk: pk, myName: name });
      // llenamos el select de centros
    }

    this.setState({ optionsCenters: optionsCentersArray });
  };

  validateEmail = () => {
    var valid = false;
    if (this.state.email === this.state.confEmail) {
      valid = true;
    }
    this.setState({ emailValidated: valid });
  };

  viewDepartmentsInfo = () => {
    console.log(this.state.infoDepartaments);
    var optionsDepArray = [];
    // recorremos todo los centros y sacamos el nombre y el id
    for (let index = 0; index < this.state.infoDepartaments.length; index++) {
      var name = this.state.infoDepartaments[index].fields.name;
      var pk = this.state.infoDepartaments[index].pk;
      console.log('Nombre del departamento: ' + name + ' pk: ' + pk);
      optionsDepArray.push({ myPk: pk, myName: name });
    }

    this.setState({ optionsDepartments: optionsDepArray }, () => {
      console.log(this.state.optionsDepartments);
    });
  };

  loadDepartaments = async () => {
    var token = JSON.parse(localStorage.getItem('token'));
    axios
      .get(URL + '/places/department/all/', {
        headers: {
          Authorization: 'JWT ' + token
        }
      })
      .then(response => {
        this.setState({ infoDepartaments: response.data }, () => {
          this.viewDepartmentsInfo();
        });
      });
  };

  saveNewUserInfo = async () => {
    var token = JSON.parse(localStorage.getItem('token'));
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
      permissions: []
    };
    if (this.state.createCenters === true) {
      json.permissions.push(
        { name: 'add_center' },
        { name: 'change_center' },
        { name: 'view_center' }
      );
    }
    if (this.state.createUsers === true) {
      json.permissions.push(
        { name: 'add_user' },
        { name: 'change_user' },
        { name: 'view_user' }
      );
    }
    var myJson = JSON.stringify(json);
    console.log('ESTE ES MI JSON: ' + myJson);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + token
    };

    axios
      .post(URL + '/users/', json, {
        headers: headers
      })
      .then(response => {
        console.log(response.status);
        this.handleCloseCreate();
      })
      .catch(error => {
        console.log('oh no, hubo un error!');
        console.warn(error.status);
      });
  };

  handleChangeCheck = event => {
    if (event.target.checked) {
      this.setState({ [event.target.name]: true });
    } else {
      this.setState({ [event.target.name]: false });
    }
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();

    this.saveNewUserInfo();
  };
  handleClose = () => {
    this.setState({ setShow: false });
  };

  handleShow = () => {
    this.setState({ setShow: true });
  };
  render() {
    const handleDismiss = () => this.setState({ show: false });
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title class='h3 text-gray-800 mb-0'>Crear usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            id='formCreateUser'
            noValidate
            validated={this.state.validated}
            onSubmit={this.handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md='4' controlId='formGridState'>
                <Form.Label>Tipo</Form.Label>
                <Form.Control
                  as='select'
                  name='type'
                  required
                  value={this.state.type}
                  onChange={this.handleChange}>
                  <option>...</option>
                  <option value='1'>Administrador</option>
                  <option value='2'>Usuario Simple</option>
                </Form.Control>
                <Form.Control.Feedback>Correcto!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md='4' controlId='validationCustom01'>
                <Form.Label>Identificación</Form.Label>
                <Form.Control
                  required
                  type='text'
                  name='userId'
                  placeholder='Identificación'
                  value={this.state.userId}
                  onChange={this.handleChange}
                />
                <Form.Control.Feedback>Correcto!</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md='4' controlId='validationCustom01'>
                <Form.Label>Nombres</Form.Label>
                <Form.Control
                  required
                  type='text'
                  name='firstName'
                  placeholder='Nombres'
                  value={this.state.firstName}
                  onChange={this.handleChange}
                />
                <Form.Control.Feedback>Correcto!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md='4' controlId='validationCustom02'>
                <Form.Label>Apellidos</Form.Label>
                <Form.Control
                  required
                  type='text'
                  name='lastName'
                  placeholder='Apellidos'
                  value={this.state.lastName}
                  onChange={this.handleChange}
                />
                <Form.Control.Feedback>Correcto!</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md='4' controlId='validationCustomUsername'>
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  name='email'
                  type='email'
                  placeholder='email'
                  value={this.state.email}
                  onChange={this.handleChange}
                  required
                />
                <Form.Control.Feedback type='invalid'>
                  Porfavor digite un correo valido
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md='4' controlId='validationCustomUsername'>
                <Form.Label>Confirmar Correo</Form.Label>
                <Form.Control
                  name='confEmail'
                  type='email'
                  placeholder='email'
                  required
                />
                <Form.Control.Feedback type='invalid'>
                  Correo no coincide
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md='4' controlId='validationCustom03'>
                <Form.Label>Centro</Form.Label>
                <Form.Control
                  as='select'
                  name='myCenter'
                  value={this.state.myCenter}
                  onChange={this.handleChange}
                  required>
                  <option>...</option>
                  {this.state.optionsCenters.map((option, index) => {
                    return (
                      <option key={index} value={option.myPk}>
                        {option.myName}
                      </option>
                    );
                  })}
                </Form.Control>
                <Form.Control.Feedback type='invalid'>
                  Porfavor, elija un centro
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md='4' controlId='validationCustom04'>
                <Form.Label>Departamento</Form.Label>
                <Form.Control
                  as='select'
                  name='myDepartment'
                  required
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

                <Form.Control.Feedback type='invalid'>
                  Porfavor, elija un departamento
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group controlId='formBasicCheckbox'>
                <Form.Label>Permisos de creación para: </Form.Label>
                <Form.Check
                  name='createCenters'
                  type='checkbox'
                  label='Centros'
                  id='checkCenters'
                  value={this.state.createCenters}
                  onChange={this.handleChangeCheck}
                />
                <Form.Check
                  name='createUsers'
                  type='checkbox'
                  label='Usuarios'
                  id='checkUsers'
                  value={this.state.createCenters}
                  onChange={this.handleChangeCheck}
                />
                <Form.Check
                  disabled
                  name='createProjects'
                  type='checkbox'
                  label='Proyectos Clinicos'
                  id='checkProjects'
                  value={this.state.createCenters}
                  onChange={this.handleChangeCheck}
                />
              </Form.Group>
            </Form.Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='danger' onClick={this.handleCloseCreate}>
            Cancelar
          </Button>
          <Button form='formCreateUser' type='submit'>
            Crear Usuario
          </Button>
        </Modal.Footer>
        <div>
          <Alert
            variant='danger'
            show={this.state.show}
            onClose={handleDismiss}
            dismissible>
            <p className='mb-0'>{this.state.message}</p>
          </Alert>
        </div>
      </>
    );
  }
}

export default CreateUser;
