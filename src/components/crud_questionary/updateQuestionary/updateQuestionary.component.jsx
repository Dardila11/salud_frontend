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
    .min(0, 'Debe ser un numero positivo')
    .required('Campo requerido'),
  num_maxRegistry: Yup.number()
    .min(0, 'Debe ser un numero positivo')
    .required('Campo requerido')
});

/**
 * @author Dardila
 * @description Este componente se encarga de la creacion de nuevos
 * proyectos de estudios
 */
class UpdateQuestionary extends Component {
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

  handleCloseUpdate = () => {
    this.props.handleCloseUpdate();
  };

  update = values => {
    const headers = Utils.getHeader();
    var json = {
      questionary_id: this.props.questionary.pk,
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
    console.log(json);
    this.setState({ progress: true }, () => {
      axios
        .put(URL + '/questionaries/', json, {
          headers: headers
        })
        .then(() => {
          this.setState({ progress: false });
          this.handleCloseUpdate();
        })
        .catch(() => {
          this.setState({
            progress: false,
            alertVariant: 'danger',
            alertMessage: 'No se pudo actualizar.'
          });
          Utils.showAlert(this.state.alertId);
        });
    });
  };

  componentDidMount() {
    console.log(this.props.questionary);
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
            code: this.props.questionary.fields.code,
            title: this.props.questionary.fields.title,
            description: this.props.questionary.fields.description,
            num_minRegistry: this.props.questionary.fields.num_minRegistry,
            num_maxRegistry: this.props.questionary.fields.num_maxRegistry,
            is_read: this.props.questionary.fields.is_read,
            is_accessExternal: this.props.questionary.fields.is_accessExternal
          }}
          validationSchema={schema}
          onSubmit={this.update}>
          {({
            handleSubmit,
            handleChange,
            values,
            touched,
            errors
          }) => (
            <>
              <Modal.Header closeButton>
                <Modal.Title className='h3 text-gray-800 mb-0'>
                  Actualizar cuestionario
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  <i className='required'>* Campos obligatorios</i>
                </p>
                <Form id='formCreateProject' onSubmit={handleSubmit}>
                  <Form.Row>
                    <Form.Group as={Col} md='3' controlId='inputId'>
                      <Form.Label>
                        Código <span className='required'>*</span>
                      </Form.Label>
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
                      <Form.Label>
                        Título <span className='required'>*</span>
                      </Form.Label>
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
                      <Form.Label>
                        No. mínimo de registros{' '}
                        <span className='required'>*</span>
                      </Form.Label>
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
                      <Form.Label>
                        No. máximo de registros{' '}
                        <span className='required'>*</span>
                      </Form.Label>
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
                  Actualizar cuestionario
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

export default UpdateQuestionary;
