import React, { Component } from 'react';
import axios from 'axios';

import { Button, Col, Form, Modal, ProgressBar } from 'react-bootstrap';
import { Formik } from 'formik';
import { URL } from '../../utils/URLSever';
import AlertComponent from '../../layout/alert/alert.component';
import * as Utils from '../../utils/utils';
import * as Yup from 'yup';

const schema = Yup.object({
  code: Yup.string()
    .min(5, 'Mínimo 5 caracteres')
    .max(10, 'Máximo 10 caracteres')
    .required('Campo requerido'),
  title: Yup.string()
    .min(5, 'Mínimo 5 caracteres')
    .max(36, 'Máximo 36 caracteres')
    .required('Campo requerido'),
  num_minRegistry: Yup.number()
    .positive('Debe ser un numero positivo')
    .required('Campo requerido'),
  num_maxRegistry: Yup.number()
    .positive('Debe ser un numero positivo')
    .required('Campo requerido')
});

/**
 * @author Dardila
 * @description Este componente se encarga de la creacion de nuevos
 * proyectos de estudios
 */
class CreateQuestionary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: [],
      progress: false,
      alertMessage: '',
      alertVariant: '',
      alertId: 'alert-create-questionary'
    };
  }

  handleClose = () => {
    this.props.handleClose();
  };

  handleCloseCreate = () => {
    this.props.handleCloseCreate();
  };

  save = values => {
    const headers = Utils.getHeader();
    var json = {
      questionary: {
        code: values.code,
        title: values.title,
        description: values.description,
        num_minRegistry: values.num_minRegistry,
        num_maxRegistry: values.num_maxRegistry,
        is_read: values.is_read,
        is_accessExternal: values.is_accessExternal,
        study_id: this.props.study
      }
    };
    console.log(json)
    this.setState({ progress: true }, () => {
      axios
        .post(URL + '/questionaries/', json, {
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
            alertMessage: 'No se pudo crear.'
          });
          Utils.showAlert(this.state.alertId);
        });
    });
  };
  componentDidMount() {
    console.log(this.props.usersInfo);
  }

  render() {
    return (
      <>
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
            code: '',
            title: '',
            description: '',
            num_minRegistry: 0,
            num_maxRegistry: 0,
            is_read: false,
            is_accessExternal: false
          }}
          validationSchema={schema}
          onSubmit={this.save}>
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            errors
          }) => (
            <>
              <Modal.Header closeButton>
                <Modal.Title className='h3 text-gray-800 mb-0'>
                  Crear cuestionario
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  <i className='required'>
                    * Todos los campos son obligatorios
                  </i>
                </p>
                <Form id='formCreateProject' onSubmit={handleSubmit}>
                  <Form.Row>
                    <Form.Group as={Col} md='3' controlId='inputId'>
                      <Form.Label>Código</Form.Label>
                      <Form.Control
                        type='text'
                        name='code'
                        placeholder='Ej. abc123'
                        value={values.code}
                        onChange={handleChange}
                        isValid={touched.code && !errors.code}
                        isInvalid={!!errors.code}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.code}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='5' controlId='inputId'>
                      <Form.Label>Título</Form.Label>
                      <Form.Control
                        type='text'
                        name='title'
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
                    <Form.Group as={Col} md='2'>
                      <Form.Check
                        type='checkbox'
                        id='is_read'
                        name='is_read'
                        label='Lectura'
                        value={values.is_read}
                        checked={values.is_read}
                        onChange={handleChange}
                      />
                      <Form.Check
                        type='checkbox'
                        id='is_accessExternal'
                        name='is_accessExternal'
                        label='Acceso externo'
                        value={values.is_accessExternal}
                        checked={values.is_accessExternal}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md='5' controlId='inputId'>
                      <Form.Label>No. mínimo de registros</Form.Label>
                      <Form.Control
                        type='number'
                        name='num_minRegistry'
                        value={values.num_minRegistry}
                        onChange={handleChange}
                        isValid={
                          touched.num_minRegistry && !errors.num_minRegistry
                        }
                        isInvalid={!!errors.num_minRegistry}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.num_minRegistry}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='5' controlId='inputId'>
                      <Form.Label>No. máximo de registros</Form.Label>
                      <Form.Control
                        type='number'
                        name='num_maxRegistry'
                        value={values.num_maxRegistry}
                        onChange={handleChange}
                        isValid={
                          touched.num_maxRegistry && !errors.num_maxRegistry
                        }
                        isInvalid={!!errors.num_maxRegistry}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.num_maxRegistry}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md='12' controlId='inputId'>
                      <Form.Label>Descripción</Form.Label>
                      <Form.Control
                        as='textarea'
                        name='description'
                        placeholder='Ej. Formato único'
                        value={values.description}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Form.Row>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={this.handleClose}>
                  Cancelar
                </Button>
                <Button form='formCreateProject' type='submit'>
                  Crear Proyecto
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
      </>
    );
  }
}

export default CreateQuestionary;
