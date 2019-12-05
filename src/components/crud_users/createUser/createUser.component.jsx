import React, { Component } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { URL } from '../../utils/URLSever';
import { Button, Modal, Form, Col ,Alert} from 'react-bootstrap';
import * as Yup from 'yup';

/**
 * @todo - Agregar el asterisk de 'obligaotrio para cada label
 * - mostrar permisos de creacion de centros y usuarios si
 * solo si se selecciona administrador como el tipo
 */

/**
 * @var schema Crear un objecto Yup el cual se encarga de todas las
 * validaciones de los campos del formulario
 */
const schema = Yup.object({
  userId: Yup.string()
    .min(4, 'Id debe tener minimo 4 caracteres')
    .required('Campo Requerido'),
  firstName: Yup.string()
    .min(3, 'Nombre debe tener minimo 3 caracteres')
    .required('Campo Requerido'),
  lastName: Yup.string()
    .min(3, 'Apellido debe tener minimo 3 caracteres')
    .required('Campo Requerido'),
  email: Yup.string()
    .email('Email Invalido')
    .required('Campo Requerido'),
  confEmail: Yup.string()
    .email('Email invalido')
    .oneOf([Yup.ref('email'), null], 'Emails no coinciden')
    .required('Campo Requerido'),
  myCenter: Yup.string().required('Campo Requerido'),
  myDepartment: Yup.string().required('Campo Requerido'),
  type: Yup.string().required('Campo Requerido ')
});

/**
 * @author Dardila
 * @description Este componente se encarga de la creación de un usuario nuevo en la plataforma.
 * Se llena un formulario con los datos del usuario a crear ( Id, firstName, lastName, Email,
 * Center, Department and Permissions)
 */
class CreateUserFormik extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibility: false,
      alertVariant: "",
      message: "",
      showForget:false,
      show: false
    };
  }

  /**
   * @function saveNewUserInfo
   * @description Se encarga de cargar los datos del nuevo usuario
   * en un json y enviar una solicitud de creacion al servidor
   */
  saveNewUserInfo = async values => {
    var token = JSON.parse(localStorage.getItem('token'));
    console.log('el token es ' + token);
    var json = {
      user: {
        type: values.type,
        user_id: values.userId,
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        my_center: values.myCenter,
        my_department: values.myDepartment
      },
      permissions: []
    };
    if (values.createCenters === true) {
      json.permissions.push(
        { name: 'add_center' },
        { name: 'change_center' },
        { name: 'view_center' }
      );
    }
    if (values.createUsers === true) {
      json.permissions.push(
        { name: 'add_user' },
        { name: 'change_user' },
        { name: 'view_user' }
      );
    }
    var myJson = JSON.stringify(json);
    console.log(myJson);
    /**
     * headers: son necesarios para realizar la
     * solicitud al servidor. se le envia el JWT y
     * el token como autorización
     */
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
        alert(response.data)
        //this.handleCloseCreate();
      })
        .catch(error => {
          alert(error.response.data);
        });
  };

  handleClose = () => {
    this.props.handleClose();
  };

  handleCloseCreate = () => {
    this.props.handleCloseCreate();
  };
  render() {
    return (
      <>
        <Formik
          noValidate
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{
            type: '',
            userId: '',
            firstName: '',
            lastName: '',
            email: ''.toLowerCase(),
            confEmail: ''.toLowerCase(),
            myCenter: '',
            myDepartment: '',
            createCenters: false,
            createUsers: false,
            createProjects: false
          }}
          validationSchema={schema}
          onSubmit={this.saveNewUserInfo}>
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors
          }) => (
            <>
              <Modal.Header closeButton>
                <Modal.Title className='h3 text-gray-800 mb-0'>
                  Crear usuario
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form id='formCreateUser' onSubmit={handleSubmit}>
                  <Form.Row>
                    <Form.Group as={Col} md='5' controlId='validationFormik01'>
                      <Form.Label>Tipo de Usuario</Form.Label>
                      <Form.Control
                        as='select'
                        name='type'
                        value={values.type}
                        onChange={handleChange}
                        isInvalid={!!errors.type}
                        isValid={touched.type && !errors.type}>
                        <option value={-1}>------</option>
                        <option value='1'>Administrador</option>
                        <option value='2'>Usuario Simple</option>
                      </Form.Control>
                      <Form.Control.Feedback type='invalid'>
                        {errors.type}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='5' controlId='validationCustom01'>
                      <Form.Label>Identificación</Form.Label>
                      <Form.Control
                        type='text'
                        name='userId'
                        placeholder='Identificación'
                        value={values.userId}
                        onChange={handleChange}
                        isValid={touched.userId && !errors.userId}
                        isInvalid={!!errors.userId}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.userId}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md='5' controlId='validationCustom01'>
                      <Form.Label>Nombres</Form.Label>
                      <Form.Control
                        type='text'
                        name='firstName'
                        placeholder='Nombres'
                        value={values.firstName}
                        onChange={handleChange}
                        isValid={touched.firstName && !errors.firstName}
                        isInvalid={!!errors.firstName}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.firstName}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='5' controlId='validationCustom02'>
                      <Form.Label>Apellidos</Form.Label>
                      <Form.Control
                        type='text'
                        name='lastName'
                        placeholder='Apellidos'
                        value={values.lastName}
                        onChange={handleChange}
                        isValid={touched.lastName && !errors.lastName}
                        isInvalid={!!errors.lastName}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.lastName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group
                      as={Col}
                      md='5'
                      controlId='validationCustomUsername'>
                      <Form.Label>Correo</Form.Label>
                      <Form.Control
                        name='email'
                        type='email'
                        placeholder='email'
                        value={values.email}
                        onChange={handleChange}
                        isValid={touched.email && !errors.email}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      md='5'
                      controlId='validationCustomUsername'>
                      <Form.Label>Confirmar Correo</Form.Label>
                      <Form.Control
                        name='confEmail'
                        type='email'
                        placeholder='email'
                        value={values.confEmail}
                        onChange={handleChange}
                        isValid={touched.confEmail && !errors.confEmail}
                        isInvalid={!!errors.confEmail}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.confEmail}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md='4' controlId='validationCustom03'>
                      <Form.Label>Centro</Form.Label>
                      <Form.Control
                        as='select'
                        name='myCenter'
                        value={values.myCenter}
                        onChange={handleChange}
                        required
                        isInvalid={!!errors.myCenter}
                        isValid={touched.myCenter && !errors.myCenter}>
                        <option value={-1}>------</option>
                        {this.props.infoCenters.map((option, index) => {
                          return (
                            <option key={index} value={option.myPk}>
                              {option.myName}
                            </option>
                          );
                        })}
                      </Form.Control>
                      <Form.Control.Feedback type='invalid'>
                        {errors.myCenter}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='4' controlId='validationCustom04'>
                      <Form.Label>Departamento</Form.Label>
                      <Form.Control
                        as='select'
                        name='myDepartment'
                        required
                        value={values.myDepartment}
                        onChange={handleChange}
                        isInvalid={!!errors.myDepartment}
                        isValid={touched.myDepartment && !errors.myDepartment}>
                        <option value={-1}>------</option>
                        {this.props.infoDepartaments.map((option, index) => {
                          return (
                            <option key={index} value={option.myPk}>
                              {option.myName}
                            </option>
                          );
                        })}
                      </Form.Control>

                      <Form.Control.Feedback type='invalid'>
                        {errors.myDepartment}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group controlId='formBasicCheckbox'>
                      <Form.Label>Permisos de creación para: </Form.Label>
                      <Form.Check
                        disabled={values.type === '1' ? false : true}
                        name='createCenters'
                        type='checkbox'
                        label='Centros'
                        id='checkCenters'
                        value={values.createCenters}
                        onChange={handleChange}
                      />
                      <Form.Check
                        disabled={values.type === '1' ? false : true}
                        name='createUsers'
                        type='checkbox'
                        label='Usuarios'
                        id='checkUsers'
                        value={values.createUsers}
                        onChange={handleChange}
                      />
                      {/* <Form.Check
                        disabled
                        name='createProjects'
                        type='checkbox'
                        label='Proyectos Clinicos'
                        id='checkProjects'
                        value={values.createCenters}
                        onChange={handleChange}
                      /> */}
                    </Form.Group>
                  </Form.Row>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={this.handleClose}>
                  Cancelar
                </Button>
                <Button form='formCreateUser' type='submit'>
                  Crear Usuario
                </Button>
              </Modal.Footer>
            </>
          )}
        </Formik>
      </>
    );
  }
}

export default CreateUserFormik;
