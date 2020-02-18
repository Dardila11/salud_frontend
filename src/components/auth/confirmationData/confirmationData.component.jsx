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
  firstName: Yup.string()
    .min(3, 'Nombre debe tener minimo 3 caracteres')
    .required('Campo requerido'),
    userId: Yup.string()
    .min(10, 'El numero de Identificacón debe tener minimo 10 caracteres')
    .required('Campo requerido'),
  lastName: Yup.string()
    .min(3, 'Apellido debe tener minimo 3 caracteres')
    .required('Campo requerido'),
  pass1: Yup.string().min(6, 'Contraseña debe tener minimo 6 caracteres'),
  pass2: Yup.string().oneOf([Yup.ref('pass1'), null], 'Contraseña no coincide')
});

/**
 * @author Dardila
 * @description Este componente se encarga de la actualizacion de informacion
 * de un usuario en la plataforma.
 */
class Confirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: false,
      //isAdmin: this.props.userInfo[0].is_staff ? true : false,
      alertMessage: '',
      alertVariant: '',
      alertId: 'alert-create-update'
    };
  }

  handleClose = () => {
    this.props.handleClose();
  };

  handleCloseConfirm = () => {
    //this.getMembers();
    this.props.handleCloseConfirm();
  };

  /**
   * @function updateUserInfo
   * @description Se encarga de guardar los datos modificados del usuario
   */
  updateUserInfo = async values => {
      
    const headers = getHeader();
    const data = {
      email_instance: values.email,
      user: {
        first_name: values.firstName,
        last_name: values.lastName,
        user_id: values.userId,
        password: values.pass1,
        
      }
    };
    console.log(JSON.stringify(data));
    this.setState({ progress: true }, () =>
      axios
        .post(URL + '/users/confirm/', data, { headers: headers })
        .then(() => {
          this.setState({ progress: false });
          this.handleCloseConfirm();
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
    /*  
    if (this.props.userPermissions.length > 1) {
      return (
        this.props.userPermissions.filter(e =>
          e.user_permissions__codename.includes('_center')
        ).length === 3
      );
    }
    */
    return false;
    
    };


  isPermissionsUsers = () => {/*
    if (this.props.userPermissions.length > 1) {
      return (
        this.props.userPermissions.filter(e =>
          e.user_permissions__codename.includes('_user')
        ).length === 3
      );
    }
    */
    return false;
  };
  componentDidMount() {
    console.log('___________________')
  console.log(this.props)
  }
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
            firstName:toCapitalizer(this.props.userInfo.first_name),
            lastName:toCapitalizer(this.props.userInfo.last_name),
            email: this.props.userInfo.email,
            confEmail: this.props.email,
            userId:this.props.userInfo.user_id,
            myCenter: 'center '/*this.props.userInfo[0].my_center*/,
            myDepartment:'Departament' /*this.props.userInfo[0].my_department*/,
            createCenters: this.isPermissionsCenters(),
            createUsers: this.isPermissionsUsers()
          }}
          validationSchema={schema}
          onSubmit={this.updateUserInfo}>
          {({ handleSubmit, handleChange, values, touched, errors }) => (
            <>
              <Modal.Header closeButton>
                <Modal.Title className='h3 text-gray-800 mb-0'>
                  Confirme sus Datos
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

                    <Form.Group as={Col} md='6' controlId='validationCustom01'>
                      <Form.Label>Numero de Identificación</Form.Label>
                      <Form.Control
                        type='text'
                        name='userId'
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
                  <Form.Group
                        as={Col} md='6'
                        controlId='validationFormik01'
                        className='mb-2'>
                        <Form.Label>Nueva Contraseña</Form.Label>
                        <Form.Control
                          type='password'
                          name='pass1'
                          value={values.pass1}
                          onChange={handleChange}
                          isInvalid={!!errors.pass1}
                          isValid={touched.pass1 && !errors.pass1}
                          placeholder='6 Caracteres Minimo'
                          required></Form.Control>
                        <Form.Control.Feedback type='invalid'>
                          {errors.pass1}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        controlId='validationFormik02'
                        className='mb-2'>
                        <Form.Label>Repetir Contraseña</Form.Label>
                        <Form.Control
                          type='password'
                          name='pass2'
                          value={values.pass2}
                          onChange={handleChange}
                          isInvalid={!!errors.pass2}
                          isValid={touched.pass2 && !errors.pass2}
                          required></Form.Control>
                        <Form.Control.Feedback type='invalid'>
                          {errors.pass2}
                        </Form.Control.Feedback>
                      </Form.Group>

                  </Form.Row>
                  <Form.Row className={this.state.isAdmin ? '' : 'hidden'}>

                  </Form.Row>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={this.handleClose}>
                  Salir
                </Button>
                <Button form='formUpdateUser' type='submit'>
                  Confirmar
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

export default Confirmation;
