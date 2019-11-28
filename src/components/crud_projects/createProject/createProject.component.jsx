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
  projectId: Yup.string()
    .min(2, 'Id debe tener minimo 2 caracteres')
    .required('Campo Requerido'),
  title: Yup.string()
    .min(5, 'Titulo debe tener minimo 5 caracteres')
    .required('Campo Requerido')
});

/**
 * @author Dardila
 * @description Este componente se encarga de la creacion de nuevos
 * proyectos de estudios
 */
class CreateProjectFormik extends Component {
  constructor(props) {
    super(props);
  }
  handleClose = () => {
    this.props.handleClose();
  };
  handleCloseCreate = () => {
    this.props.handleCloseCreate();
  };

  saveNewProjectInfo = () => {};
  render() {
    return (
      <>
        <Formik
          noValidate
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{
            projectId: '',
            title: '',
            registerDate: '',
            startDate: '',
            endDate: '',
            projectState: '',
            principalInvestigator: '',
            responsibleInvestigator: ''
          }}
          validationSchema={schema}
          onSubmit={this.saveNewProjectInfo}>
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
                  Crear Proyecto
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form id='formCreateProject' onSubmit={handleSubmit}>
                  <Form.Row>
                    <Form.Group as={Col} md='4' controlId='inputId'>
                      <Form.Label>Id del proyecto</Form.Label>
                      <Form.Control
                        type='text'
                        name='projectId'
                        placeholder='Id'
                        value={values.projectId}
                        onChange={handleChange}
                        isValid={touched.projectId && !errors.projectId}
                        isInvalid={!!errors.projectId}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.projectId}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md='7' controlId='inputId'>
                      <Form.Label>Titulo del proyecto</Form.Label>
                      <Form.Control
                        type='text'
                        name='title'
                        placeholder='Titulo del proyecto'
                        value={values.title}
                        onChange={handleChange}
                        isValid={touched.title && !errors.title}
                        isInvalid={!!errors.title}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.title}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md='4' controlId='inputId'>
                      <Form.Label>Fecha registro</Form.Label>
                      <Form.Control
                        type='text'
                        name='registerDate'
                        placeholder='Fecha de registro'
                        value={values.registerDate}
                        onChange={handleChange}
                        isValid={touched.registerDate && !errors.registerDate}
                        isInvalid={!!errors.registerDate}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.registerDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='4' controlId='inputId'>
                      <Form.Label>Fecha Inicio</Form.Label>
                      <Form.Control
                        type='text'
                        name='registerDate'
                        placeholder='Fecha de inicio'
                        value={values.startDate}
                        onChange={handleChange}
                        isValid={touched.startDate && !errors.startDate}
                        isInvalid={!!errors.startDate}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.startDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='4' controlId='inputId'>
                      <Form.Label>Fecha Finalización </Form.Label>
                      <Form.Control
                        type='text'
                        name='registerDate'
                        placeholder='Fecha de finalización'
                        value={values.endDate}
                        onChange={handleChange}
                        isValid={touched.endDate && !errors.endDate}
                        isInvalid={!!errors.endDate}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.endDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md='4' controlId='inputId'>
                      <Form.Label>Responsable del Registro </Form.Label>
                      <Form.Control
                        type='text'
                        name='responsibleInvestigator'
                        placeholder='Responsable del registro'
                        value={values.responsibleInvestigator}
                        onChange={handleChange}
                        isValid={
                          touched.responsibleInvestigator &&
                          !errors.responsibleInvestigator
                        }
                        isInvalid={!!errors.responsibleInvestigator}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.responsibleInvestigator}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='4' controlId='inputId'>
                      <Form.Label>Investigador Principal </Form.Label>
                      <Form.Control
                        type='text'
                        name='principalInvestigator'
                        placeholder='Responsable del registro'
                        value={values.principalInvestigator}
                        onChange={handleChange}
                        isValid={
                          touched.principalInvestigator &&
                          !errors.principalInvestigator
                        }
                        isInvalid={!!errors.principalInvestigator}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.principalInvestigator}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='4' controlId='validationFormik01'>
                      <Form.Label>Estado del Estudio</Form.Label>
                      <Form.Control
                        as='select'
                        name='type'
                        value={values.projectState}
                        onChange={handleChange}
                        isInvalid={!!errors.projectState}
                        isValid={touched.projectState && !errors.projectState}>
                        <option value={-1}>------</option>
                        <option value='1'>Registro</option>
                        <option value='2'>Diseño</option>
                        <option value='3'>Finalizado</option>
                      </Form.Control>
                      <Form.Control.Feedback type='invalid'>
                        {errors.projectState}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={this.handleClose}>
                  Cancelar
                </Button>
                <Button form='formCreateUser' type='submit'>
                  Crear Proyecto
                </Button>
              </Modal.Footer>
            </>
          )}
        </Formik>
      </>
    );
  }
}

export default CreateProjectFormik;
