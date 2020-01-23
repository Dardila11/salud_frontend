import React, { Component } from 'react';
import { ProgressBar, Modal, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import * as Utils from '../../utils/utils';
import * as Yup from 'yup';
import matchSorter from 'match-sorter';

class AddParticipant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: [],
      progress: false,
      alertMessage: '',
      alertVariant: '',
      alertId: 'alert-add-participant-to-project'
    };
  }

  handleClose = () => {
    this.props.handleClose();
  };

  handleCloseAddParticipant = () => {
    this.props.handleCloseCreate();
  };

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
            idParticipant: '',
            limitAccessDate: new Date(),
            RolInProject: '',
            permissions: ''
          }}
          validationSchema={schema}
          onSubmit={this.addParticipantToProject}>
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            errors,
            setFieldValue
          }) => {
            <>
              <Modal.Header closeButton>
                <Modal.Title className='h3 text-gray-800 mb-0'>
                  Agregar integrante al proyecto
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  <i className='required'>
                    Todos los campos con asterisco (*) son obligatorios
                  </i>
                </p>
                <Form id='formAddParticipantToProject' onSubmit={handleSubmit}>
                  <Form.Row>
                    <Form.Group as={Col} md='4' controlId='inputId'>
                      <Form.Label> Nuevo integrante</Form.Label>
                      <Autocomplete
                        id='combo-box-demo'
                        options={this.props.usersInfo}
                        getOptionLabel={option =>
                          typeof option === 'string'
                            ? option
                            : Utils.toCapitalizer(option.userName)
                        }
                        style={{ width: 300 }}
                        renderOption={option => (
                          <>
                            <div>
                              <span>{option.userEmail}</span>
                              <br />
                              <span>
                                {Utils.toCapitalizer(option.userName)}
                              </span>
                              <hr />
                            </div>
                          </>
                        )}
                        value={values.idParticipant}
                        name='idParticipant'
                        onChange={(e, value) => {
                          setFieldValue('idParticipant', value);
                        }}
                        filterOptions={(options, { inputValue }) => {
                          matchSorter(options, inputValue, {
                            keys: ['userName']
                          });
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            name='idParticipant'
                            variant='outlined'
                            fullWidth
                            helperText={
                              touched.idParticipant ? errors.idParticipant : ''
                            }
                            error={
                              touched.idParticipant &&
                              Boolean(errors.idParticipant)
                            }
                          />
                        )}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.idParticipant}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.row>
                    <Form.Group as={Col} md='4' controlId='inputId'>
                      <Form.Label>Fecha limite de acceso </Form.Label>
                      <Form.Control
                        type='Date'
                        value={values.limitAccessDate}
                        onChange={handleChange}
                        locale='es'
                        className='form-control'
                        name='limitAccessDate'
                        isValid={
                          touched.limitAccessDate && !errors.limitAccessDate
                        }
                        isInvalid={!!errors.limitAccessDate}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.limitAccessDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.row>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={this.handleClose}>
                  Cancelar
                </Button>
                <Button form='formAddParticipantToProject' type='submit'>
                  Agregar Integrante
                </Button>
              </Modal.Footer>
            </>;
          }}
        </Formik>
      </>
    );
  }
}

export default AddParticipant;
