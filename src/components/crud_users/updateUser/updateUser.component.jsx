import React, { Component } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { URL } from '../../utils/URLSever';
import { Button, Modal, Form, Col } from 'react-bootstrap';
import * as Yup from 'yup';

/**
 * @var schema Crear un objecto Yup el cual se encarga de todas las
 * validaciones de los campos del formulario
 */
const schema = Yup.object({
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
  type: Yup.string().required('Campo Requerido')
});

/**
 * @author Dardila
 * @description Este componente se encarga de la actualizacion de informacion
 * de un usuario en la plataforma.
 */

class UpdateUserFormik extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleClose = () => {
    this.props.handleClose();
  };
  handleCloseUpdate = () => {
    this.props.handleCloseUpdate();
  };

  componentDidMount() {
    /*console.log('componentDidMount');
    console.log(this.props.email);
    console.log(this.props.userInfo[0].first_name);
    console.log(this.props.infoDepartaments);*/
    console.log(this.props.userPermissions[0].user_permissions__codename);
  }
  updateUserInfo = async values => {
    console.log(values.firstName);
    var token = JSON.parse(localStorage.getItem('token'));
    var json = {
      email_instance: this.props.email,
      user: {
        type: values.type,
        user_id: values.userId,
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        my_center: values.myCenter,
        my_department: values.myDepartment
      },

      /**
       * @todo agregar codigo para que se adicione
       * los permisos que son
       * Ya estamos enviando los permisos del usuario.
       * Falta agregar los checkboxes y seleccionarlos si tiene los permisos
       * luego actualizar los permisos si son cambiados.
       */
      permissions_add: [{ name: 'add_user' }, { name: 'change_user' }],
      permissions_remove: []
    };
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
      .put(URL + '/users/', json, {
        headers: headers
      })
      .then(response => {
        console.log(response.status);
        this.handleCloseUpdate();
      });
  };
  render() {
    return (
      <>
        <Formik
          noValidate
          enableReinitialize
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{
            type: this.props.userInfo[0].is_staff === true ? '1' : '2',
            firstName: this.props.userInfo[0].first_name,
            lastName: this.props.userInfo[0].last_name,
            email: this.props.email,
            confEmail: this.props.email,
            myCenter: this.props.userInfo[0].my_center,
            myDepartment: this.props.userInfo[0].my_department
          }}
          validationSchema={schema}
          onSubmit={this.updateUserInfo}>
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
                  Actualizar Usuario
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form id='formUpdate' onSubmit={handleSubmit}>
                  <Form.Row>
                    <Form.Group as={Col} md='4' controlId='validationFormik01'>
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
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md='4' controlId='validationCustom01'>
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
                    <Form.Group as={Col} md='4' controlId='validationCustom02'>
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
                      md='4'
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
                      md='4'
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
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={this.handleClose}>
                  Cancelar
                </Button>
                <Button form='formUpdate' type='submit'>
                  guardar Cambios
                </Button>
              </Modal.Footer>
            </>
          )}
        </Formik>
      </>
    );
  }
}

export default UpdateUserFormik;
