import React, { Component } from 'react';
import axios from 'axios';

import { Col, Button, Form, Modal, ProgressBar } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {
  getHeader,
  showAlert,
  toCapitalizer,
  translate
} from '../../utils/utils';
import { URL } from '../../utils/URLSever';
import AlertComponent from '../../layout/alert/alert.component';

const schema = Yup.object({
  userId: Yup.string()
    .min(4, 'Mínimo 4 caracteres')
    .required('Campo requerido'),
  firstName: Yup.string()
    .min(2, 'Mínimo 2 caracteres')
    .required('Campo requerido'),
  lastName: Yup.string()
    .min(4, 'Mínimo 4 caracteres')
    .required('Campo requerido'),
  email: Yup.string()
    .email('Correo inválido')
    .required('Campo requerido'),
  confEmail: Yup.string()
    .email('Correo inválido')
    .oneOf([Yup.ref('email'), null], 'Correo no coincide')
    .required('Campo requerido'),
  myCenter: Yup.number().positive('Campo requerido'),
  myDepartment: Yup.number().positive('Campo requerido')
});

/**
 * @author Dardila
 * @description Este componente se encarga de la actualizacion de informacion
 * de un usuario en la plataforma.
 */
class UpdateUserFormik extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: false,
      isAdmin: this.props.userInfo[0].is_staff ? true : false,
      alertMessage: '',
      alertVariant: '',
      alertId: 'alert-create-update'
    };
  }

  handleClose = () => {
    this.props.handleClose();
  };

  handleCloseUpdate = () => {
    this.props.handleCloseUpdate();
  };

  /**
   * @function updateUserInfo
   * @description Se encarga de guardar los datos modificados del usuario
   */
  updateUserInfo = async values => {
    const headers = getHeader();
    const data = {
      email_instance: this.props.email,
      user: {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        my_center: values.myCenter,
        my_department: values.myDepartment
      },
      permissions_add: [],
      permissions_remove: []
    };
    if (values.createCenters === true) {
      data.permissions_add.push(
        { name: 'add_center' },
        { name: 'change_center' },
        { name: 'view_center' }
      );
    } else {
      data.permissions_remove.push(
        { name: 'add_center' },
        { name: 'change_center' },
        { name: 'view_center' }
      );
    }
    if (values.createUsers === true) {
      data.permissions_add.push(
        { name: 'add_user' },
        { name: 'change_user' },
        { name: 'view_user' }
      );
    } else {
      data.permissions_remove.push(
        { name: 'add_user' },
        { name: 'change_user' },
        { name: 'view_user' }
      );
    }
    this.setState({ progress: true }, () =>
      axios
        .put(URL + '/users/', data, { headers: headers })
        .then(() => {
          this.setState({ progress: false });
          this.handleCloseUpdate();
        })
        .catch(error => {
          this.setState({
            progress: false,
            alertVariant: 'danger',
            alertMessage: translate(error)
          });
          showAlert(this.state.alertId);
        })
    );
  };

  isPermissionsCenters = () => {
    if (this.props.userPermissions.length > 1) {
      return (
        this.props.userPermissions.filter(e =>
          e.user_permissions__codename.includes('_center')
        ).length === 3
      );
    }
    return false;
  };

  isPermissionsUsers = () => {
    if (this.props.userPermissions.length > 1) {
      return (
        this.props.userPermissions.filter(e =>
          e.user_permissions__codename.includes('_user')
        ).length === 3
      );
    }
    return false;
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
            firstName: toCapitalizer(this.props.userInfo[0].first_name),
            lastName: toCapitalizer(this.props.userInfo[0].last_name),
            email: this.props.email,
            confEmail: this.props.email,
            myCenter: this.props.userInfo[0].my_center,
            myDepartment: this.props.userInfo[0].my_department,
            createCenters: this.isPermissionsCenters(),
            createUsers: this.isPermissionsUsers()
          }}
          validationSchema={schema}
          onSubmit={this.updateUserInfo}>
          {({ handleSubmit, handleChange, values, touched, errors }) => (
            <>
              <Modal.Header closeButton>
                <Modal.Title className='h3 text-gray-800 mb-0'>
                  Actualizar usuario
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form id='formUpdateUser' onSubmit={handleSubmit}>
                  <p>
                    <i className='required'>
                      * Todos los campos son obligatorios
                    </i>
                  </p>
                  <Form.Row>
                    <Form.Group as={Col} md='6' controlId='validationCustom01'>
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
                    <Form.Group as={Col} md='6' controlId='validationCustom02'>
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
                      md='6'
                      controlId='validationCustomUsername'>
                      <Form.Label>Confirmar correo</Form.Label>
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
                              {toCapitalizer(option.myName)}
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
                        disabled={!this.state.isAdmin}
                        name='createCenters'
                        type='checkbox'
                        label='Centros'
                        id='checkCenters'
                        value={values.createCenters}
                        checked={values.createCenters}
                        onChange={handleChange}
                      />
                      <Form.Check
                        disabled={!this.state.isAdmin}
                        name='createUsers'
                        type='checkbox'
                        label='Usuarios'
                        id='checkUsers'
                        value={values.createUsers}
                        checked={values.createUsers}
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
                <Button form='formUpdateUser' type='submit'>
                  Guardar cambios
                </Button>
              </Modal.Footer>
            </>
          )}
        </Formik>
        <AlertComponent
          alertId={this.state.alertId}
          alertVariant={this.state.alertVariant}
          alertMessage={this.state.alertMessage}></AlertComponent>
      </section>
    );
  }
}

export default UpdateUserFormik;
