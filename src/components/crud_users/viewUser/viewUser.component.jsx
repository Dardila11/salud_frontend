import React, { Component } from 'react';
import { Formik } from 'formik';
import { Button, Modal, Form, Col } from 'react-bootstrap';

/**
 * @author Dardila
 * @description Este se componente se encarga de mostrar los datos del usuario.
 * Sin que se puedan modificar
 */
class ViewUserFormik extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleClose = () => {
    this.props.handleClose();
  };

  handleCloseCreate = () => {
    this.props.handleCloseCreate();
  };

  componentDidMount() {
    console.log(this.props.userPermissions[0].user_permissions__codename);
  }
  render() {
    return (
      <>
        <Formik
          noValidate
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{
            type: this.props.userInfo[0].is_staff === true ? '1' : '2',
            firstName: this.props.userInfo[0].first_name,
            lastName: this.props.userInfo[0].last_name,
            email: this.props.email,
            confEmail: this.props.email,
            myCenter: this.props.userInfo[0].my_center,
            myDepartment: this.props.userInfo[0].my_department,
            createCenters: false,
            createUsers: false,
            createProjects: false
          }}>
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
                  Ver Usuario
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                  Cerrar
                </Button>
              </Modal.Footer>
            </>
          )}
        </Formik>
      </>
    );
  }
}

export default ViewUserFormik;
