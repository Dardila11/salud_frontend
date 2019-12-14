import React, { Component } from 'react';
import axios from 'axios';

import { Button, Col, Form, Modal, ProgressBar } from 'react-bootstrap';
import { Formik } from 'formik';
import { getHeader, toCapitalizer, showAlert } from '../../utils/utils';
import { URL } from '../../utils/URLSever';
import AlertComponent from '../../layout/alert/alert.component';
import * as Yup from 'yup';

const schema = Yup.object({
  type: Yup.number().positive('Campo requerido'),
  userId: Yup.string()
    .min(4, 'Id debe tener minimo 4 caracteres')
    .required('Campo requerido'),
  firstName: Yup.string()
    .min(3, 'Nombre debe tener minimo 3 caracteres')
    .required('Campo requerido'),
  lastName: Yup.string()
    .min(3, 'Apellido debe tener minimo 3 caracteres')
    .required('Campo requerido'),
  email: Yup.string()
    .email('Correo invalido')
    .required('Campo requerido'),
  confEmail: Yup.string()
    .email('Correo invalido')
    .oneOf([Yup.ref('email'), null], 'Correo no coincide')
    .required('Campo requerido'),
  myCenter: Yup.number().positive('Campo requerido'),
  myDepartment: Yup.number().positive('Campo requerido')
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
      progress: false,
      isAdmin: false,
      alertMessage: '',
      alertVariant: '',
      alertId: 'alert-create-user'
    };
  }

  /**
   * @function saveNewUserInfo
   * @description Se encarga de cargar los datos del nuevo usuario
   * en un data y enviar una solicitud de creacion al servidor
   */
  saveNewUserInfo = values => {
    const headers = getHeader();
    var data = {
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
      data.permissions.push(
        { name: 'add_center' },
        { name: 'change_center' },
        { name: 'view_center' }
      );
    }
    if (values.createUsers === true) {
      data.permissions.push(
        { name: 'add_user' },
        { name: 'change_user' },
        { name: 'view_user' }
      );
    }
    this.setState({ progress: true }, () =>
      axios
        .post(URL + '/users/', data, {
          headers: headers
        })
        .then(() => {
          this.setState({ progress: false });
          this.handleCloseCreate();
        })
        .catch(error => {
          this.setState({
            progress: false,
            alertVariant: 'danger',
            alertMessage: JSON.parse(error.request.response).detail
          });
          showAlert(this.state.alertId);
        })
    );
  };

  handleChange = event => {
    this.setState({
      isAdmin: parseInt(event.target.value) === 1 ? true : false
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
      <section>
        {this.state.progress ? (
          <ProgressBar
            className='progress'
            animated
            now={100}
            id='progress-admin'
          />
        ) : (
          <></>
        )}
        <Formik
          noValidate
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{
            type: -1,
            userId: '',
            firstName: '',
            lastName: '',
            email: ''.toLowerCase(),
            confEmail: ''.toLowerCase(),
            myCenter: -1,
            myDepartment: -1,
            createCenters: true,
            createUsers: false,
            createProjects: false
          }}
          validationSchema={schema}
          onSubmit={this.saveNewUserInfo}>
          {({ handleSubmit, handleChange, values, touched, errors }) => (
            <>
              <Modal.Header closeButton>
                <Modal.Title className='h3 text-gray-800 mb-0'>
                  Crear usuario
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  <i className='required'>
                    * Todos los campos son obligatorios
                  </i>
                </p>
                <Form id='formCreateUser' onSubmit={handleSubmit}>
                  <Form.Row>
                    <Form.Group as={Col} md='5' controlId='validationFormik01'>
                      <Form.Label>Tipo de usuario</Form.Label>
                      <Form.Control
                        as='select'
                        name='type'
                        value={values.type}
                        onChange={e => {
                          handleChange(e);
                          this.handleChange(e);
                        }}
                        isInvalid={!!errors.type}
                        isValid={touched.type && !errors.type}>
                        <option value={-1}>---</option>
                        <option value={1}>Administrador</option>
                        <option value={2}>Usuario simple</option>
                      </Form.Control>
                      <Form.Control.Feedback type='invalid'>
                        {errors.type}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='7' controlId='validationCustom01'>
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
                    <Form.Group as={Col} md='6' controlId='validationCustom02'>
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
                    <Form.Group as={Col} md='6' controlId='validationCustom03'>
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
                      md='6'
                      controlId='validationCustomUsername'>
                      <Form.Label>Correo</Form.Label>
                      <Form.Control
                        name='email'
                        type='email'
                        placeholder='Correo'
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
                      md='6'
                      controlId='validationCustomUsername'>
                      <Form.Label>Confirmar correo</Form.Label>
                      <Form.Control
                        name='confEmail'
                        type='email'
                        placeholder='Confirmar correo'
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
                    <Form.Group as={Col} md='4' controlId='validationCustom04'>
                      <Form.Label>Centro</Form.Label>
                      <Form.Control
                        as='select'
                        name='myCenter'
                        value={values.myCenter}
                        onChange={handleChange}
                        required
                        isInvalid={!!errors.myCenter}
                        isValid={touched.myCenter && !errors.myCenter}>
                        <option value={-1}>---</option>
                        {this.props.infoCenters.map((option, index) => {
                          return (
                            <option key={index} value={option.myPk}>
                              {toCapitalizer(option.myName)}
                            </option>
                          );
                        })}
                      </Form.Control>
                      <Form.Control.Feedback type='invalid'>
                        {errors.myCenter}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='4' controlId='validationCustom05'>
                      <Form.Label>Departamento</Form.Label>
                      <Form.Control
                        as='select'
                        name='myDepartment'
                        required
                        value={values.myDepartment}
                        onChange={handleChange}
                        isInvalid={!!errors.myDepartment}
                        isValid={touched.myDepartment && !errors.myDepartment}>
                        <option value={-1}>---</option>
                        {this.props.infoDepartaments.map((option, index) => {
                          return (
                            <option key={index} value={option.myPk}>
                              {toCapitalizer(option.myName)}
                            </option>
                          );
                        })}
                      </Form.Control>
                      <Form.Control.Feedback type='invalid'>
                        {errors.myDepartment}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row className={this.state.isAdmin ? '' : 'hidden'}>
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
                  Crear usuario
                </Button>
              </Modal.Footer>
            </>
          )}
        </Formik>
        <AlertComponent
          alertId={this.state.alertId}
          alertVariant={this.state.alertVariant}
          alertMessage={this.state.alertMessage}
        />
      </section>
    );
  }
}

export default CreateUserFormik;
