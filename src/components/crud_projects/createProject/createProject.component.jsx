import React, { Component } from 'react';
import axios from 'axios';

import { Button, Col, Form, Modal, ProgressBar } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import { URL } from '../../utils/URLSever';
import AlertComponent from '../../layout/alert/alert.component';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import DatePicker, { registerLocale } from 'react-datepicker';
import matchSorter from 'match-sorter';
import * as Utils from '../../utils/utils';
import * as Yup from 'yup';

import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';

registerLocale('es', es);

var moment = require('moment');

/**
 * @var schema Crear un objecto Yup el cual se encarga de todas las
 * validaciones de los campos del formulario
 */
const schema = Yup.object({
  projectId: Yup.string()
    .min(10, 'Mínimo 10 caracteres')
    .required('Campo Requerido'),
  title: Yup.string()
    .min(5, 'Mínimo 5 caracteres')
    .max(150, 'Máximo 150 caracteres')
    .required('Campo Requerido'),
  registerDate: Yup.date().required('Campo Requerido'),
  startDate: Yup.date().required('Campo Requerido'),
  /* por si se salta la validacion de react-datepicker */
  endDate: Yup.date()
    .required('Campo Requerido')
    .when(
      'startDate',
      (startDate, schema) =>
        startDate && schema.min(startDate, 'Debe ser mayor a la fecha inicial')
    ),
  principalInvestigator: Yup.string().required('Campo Requerido'),
  responsibleInvestigator: Yup.string().required('Campo Requerido')
});

/**
 * @author Dardila
 * @description Este componente se encarga de la creacion de nuevos
 * proyectos de estudios
 */
class CreateProjectFormik extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: [],
      progress: false,
      alertMessage: '',
      alertVariant: '',
      alertId: 'alert-create-project'
    };
  }

  handleClose = () => {
    this.props.handleClose();
  };

  handleCloseCreate = () => {
    this.props.handleCloseCreate();
  };
  saveNewProjectInfo = values => {
    const headers = Utils.getHeader();
    var json = {
      study: {
        study_id: values.projectId,
        title_little: values.title.toLowerCase(),
        title_long: values.title.toLowerCase(),
        status: 1,
        date_in_study: moment(values.startDate).format('YYYY-MM-DD'),
        date_prevout_end: null,
        date_actout_end: null,
        date_trueaout_end: moment(values.endDate).format('YYYY-MM-DD'),
        description: null,
        promoter: null,
        financial_entity: null,
        amount: null,
        manager_reg: JSON.parse(localStorage.getItem('id')),
        principal_inv: values.principalInvestigator.userId,
        manager_1: null,
        manager_2: null
      }
    };
    this.setState({ progress: true }, () => {
      axios
        .post(URL + '/studies/', json, {
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
            alertMessage: 'no se pudo crear proyecto'
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
            projectId: Utils.genId(10),
            title: '',
            registerDate: new Date(),
            startDate: '',
            endDate: '',
            principalInvestigator: '',
            responsibleInvestigator:
              JSON.parse(localStorage.getItem('first_name')) +
              ' ' +
              JSON.parse(localStorage.getItem('last_name'))
          }}
          validationSchema={schema}
          onSubmit={this.saveNewProjectInfo}>
          {({
            handleSubmit,
            handleChange,
            values,
            touched,
            errors,
            setFieldValue
          }) => (
            <>
              <Modal.Header closeButton>
                <Modal.Title className='h3 text-gray-800 mb-0'>
                  Crear proyecto
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
                    <Form.Group as={Col} md='4' controlId='inputId1'>
                      <Form.Label>ID del proyecto</Form.Label>
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
                      <Form.Label>Título del proyecto</Form.Label>
                      <Form.Control
                        type='text'
                        name='title'
                        placeholder='Ej. Control prenatal'
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
                    <Form.Group as={Col} md='4' controlId='inputId2'>
                      <Form.Label>Fecha registro</Form.Label>
                      <DatePicker
                        selected={values.registerDate}
                        dateFormat='dd-MM-yyyy'
                        disabled
                        locale='es'
                        className='form-control'
                        name='registerDate'
                        onChange={date => setFieldValue('registerDate', date)}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md='4' controlId='inputId3'>
                      <Form.Label>Fecha inicio</Form.Label>
                      <DatePicker
                        placeholderText='dd-mm-aaaa'
                        selected={values.startDate}
                        dateFormat='dd-MM-yyyy'
                        yearDropdownItemNumber={5}
                        showYearDropdown
                        locale='es'
                        name='registerDate'
                        onChange={date =>
                          setFieldValue('startDate', date === null ? '' : date)
                        }
                        className={
                          'form-control ' +
                          (touched.startDate && !errors.startDate
                            ? 'is-valid'
                            : '') +
                          (!!errors.startDate ? 'is-invalid' : '')
                        }
                      />
                      <Form.Control.Feedback
                        type='invalid'
                        className={
                          (touched.startDate && !errors.startDate
                            ? 'd-none'
                            : '') + (!!errors.startDate ? 'd-block' : '')
                        }>
                        {errors.startDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='4' controlId='inputId4'>
                      <Form.Label>Fecha finalización</Form.Label>
                      <DatePicker
                        placeholderText='dd-mm-aaaa'
                        selected={values.endDate}
                        dateFormat='dd-MM-yyyy'
                        yearDropdownItemNumber={5}
                        minDate={values.startDate}
                        showYearDropdown
                        locale='es'
                        name='registerDate'
                        onChange={date =>
                          setFieldValue(
                            'endDate',
                            date === null ? '' : date
                          )
                        }
                        className={
                          'form-control ' +
                          (touched.endDate && !errors.endDate
                            ? 'is-valid'
                            : '') +
                          (!!errors.endDate ? 'is-invalid' : '')
                        }
                      />
                      <Form.Control.Feedback
                        type='invalid'
                        className={
                          (touched.endDate && !errors.endDate
                            ? 'd-none'
                            : '') + (!!errors.endDate ? 'd-block' : '')
                        }>
                        {errors.endDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md='4' controlId='inputId5'>
                      <Form.Label>Responsable del registro</Form.Label>
                      <Form.Control
                        type='text'
                        disabled
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
                    <Form.Group as={Col} md='4' controlId='inputId6'>
                      <Form.Label>Director del proyecto</Form.Label>
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
                          <React.Fragment>
                            <div>
                              <span>{option.userEmail}</span>
                              <br />
                              <span>
                                {Utils.toCapitalizer(option.userName)}
                              </span>
                              <hr />
                            </div>
                          </React.Fragment>
                        )}
                        value={values.principalInvestigator}
                        name='principalInvestigator'
                        onChange={(e, value) => {
                          setFieldValue('principalInvestigator', value);
                        }}
                        filterOptions={(options, { inputValue }) =>
                          matchSorter(options, inputValue, {
                            keys: ['userName']
                          })
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            name='principalInvestigator'
                            variant='outlined'
                            fullWidth
                            helperText={
                              touched.principalInvestigator
                                ? errors.principalInvestigator
                                : ''
                            }
                            error={
                              touched.principalInvestigator &&
                              Boolean(errors.principalInvestigator)
                            }
                          />
                        )}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.principalInvestigator}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={this.handleClose}>
                  Cancelar
                </Button>
                <Button form='formCreateProject' type='submit'>
                  Crear proyecto
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

export default CreateProjectFormik;
