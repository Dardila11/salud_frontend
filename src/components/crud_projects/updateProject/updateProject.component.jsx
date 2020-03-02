import React, { Component } from 'react';
import axios from 'axios';

import { Button, Col, Form, Modal } from 'react-bootstrap';
import { Formik } from 'formik';
import { URL } from '../../utils/URLSever';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import matchSorter from 'match-sorter';
import TextField from '@material-ui/core/TextField';
import * as Yup from 'yup';

import AlertComponent from '../../layout/alert/alert.component';
import * as Utils from '../../utils/utils';

import 'react-datepicker/dist/react-datepicker.css';

registerLocale('es', es);
var moment = require('moment');

/**
 * @var schema Crea un objecto Yup el cual se encarga de todas las
 * validaciones de los campos del formulario
 */
const schema = Yup.object({
  projectId: Yup.string()
    .test(
      'len',
      'Id debe tener exactamente 10 caracteres',
      val => val.length === 10
    )
    .required('Campo Requerido'),
  title: Yup.string()
    .min(5, 'Titulo debe tener minimo 5 caracteres')
    .max(150, 'Titulo debe tener maximo 150 caracteres')
    .required('Campo Requerido'),
  registerDate: Yup.date().required('Campo Requerido'),
  startDate: Yup.date().required('Campo Requerido'),
  /* por si se salta la validacion de react-datepicker */
  endDate: Yup.date()
    .required('Campo Requerido')
    .when(
      'startDate',
      (startDate, schema) =>
        startDate &&
        schema.min(startDate, 'La fecha final debe ser posterior a la inicial')
    ),
  principalInvestigator: Yup.string().required('Campo Requerido'),
  responsibleInvestigator: Yup.string().required('Campo Requerido'),
  projectStatus: Yup.string().required('Campo Requerido')
});

/**
 * @author Dardila
 * @description Este componente se encarga de la actualizacion de informacion
 * de un proyecto en la plataforma.
 */
class UpdateProjectFormik extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertMessage: '',
      alertVariant: '',
      alertId: 'alert-update-project'
    };
  }

  handleClose = () => {
    this.props.handleClose();
  };

  handleCloseUpdate = () => {
    this.props.handleCloseUpdate();
  };
  /**
   * @function updateProjectInfo
   * @description Se encarga de guardar los datos modificados en un json
   * y enviar una solicitud de actualizacion al servidor.
   */
  updateProjectInfo = values => {
    console.log('entra al updateProjectInfo');
    const headers = Utils.getHeader();
    var json = {
      study_id: this.props.projectInfo[0].pk,
      study: {
        study_id: values.projectId,
        title_little: values.title,
        title_long: values.title,
        status: values.projectStatus,
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
    axios
      .put(URL + '/studies/', json, { headers: headers })
      .then(response => {
        console.log(response.status);
        this.handleCloseUpdate();
      })
      .catch(error => {
        console.log(error);
        this.setState({
          alertVariant: 'danger',
          alertMessage: 'JSON.parse(error.request.response).detail'
        });
        Utils.showAlert(this.state.alertId);
      });
    console.log('update');
  };

  render() {
    return (
      <>
        <Formik
          noValidate
          validateOnChange={false}
          validateOnBlur={true}
          initialValues={{
            projectStatus: this.props.projectInfo[0].fields.status,
            projectId: this.props.projectInfo[0].fields.study_id,
            title: this.props.projectInfo[0].fields.title_little,
            registerDate: new Date(
              this.props.projectInfo[0].fields.date_reg.substring(0, 10)
            ),
            startDate: new Date(
              this.props.projectInfo[0].fields.date_in_study.substring(0, 10)
            ),
            endDate: new Date(
              this.props.projectInfo[0].fields.date_trueaout_end.substring(
                0,
                10
              )
            ),
            principalInvestigator: this.props.usersInfo.filter(
              value =>
                value.userId === this.props.projectInfo[0].fields.principal_inv
            )[0],
            responsibleInvestigator:
              JSON.parse(localStorage.getItem('first_name')) +
              ' ' +
              JSON.parse(localStorage.getItem('last_name'))
          }}
          validationSchema={schema}
          onSubmit={this.updateProjectInfo}>
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            errors,
            setFieldValue
          }) => (
            <>
              <Modal.Header closeButton>
                <Modal.Title className='h3 text-gray-800 mb-0'>
                  Actualizar proyecto
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  <i className='required'>
                    * Todos los campos son obligatorios
                  </i>
                </p>
                <Form id='formUpdateProject' onSubmit={handleSubmit}>
                  <Form.Row>
                    <Form.Group as={Col} md='4' controlId='inputId8'>
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
                    <Form.Group as={Col} md='7' controlId='inputId7'>
                      <Form.Label>Título del proyecto</Form.Label>
                      <Form.Control
                        type='text'
                        name='title'
                        onBlur={handleBlur}
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
                    <Form.Group as={Col} md='4' controlId='inputId6'>
                      <Form.Label>Fecha registro</Form.Label>
                      <DatePicker
                        selected={values.registerDate}
                        dateFormat='dd-MM-yyyy'
                        disabled
                        locale='es'
                        className='form-control'
                        name='registerDate'
                      />
                    </Form.Group>
                    <Form.Group as={Col} md='4' controlId='inputId5'>
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
                          setFieldValue('endDate', date === null ? '' : date)
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
                          (touched.endDate && !errors.endDate ? 'd-none' : '') +
                          (!!errors.endDate ? 'd-block' : '')
                        }>
                        {errors.endDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md='4' controlId='inputId3'>
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
                    <Form.Group as={Col} md='8' controlId='inputId2'>
                      <Form.Label>Director de proyecto</Form.Label>
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
                    <Form.Group as={Col} md='4' controlId='inputId1'>
                      <Form.Label>Estado</Form.Label>
                      <Form.Control
                        as='select'
                        name='projectStatus'
                        value={values.projectStatus}
                        onChange={handleChange}
                        isInvalid={!!errors.projectStatus}
                        isValid={
                          touched.projectStatus && !errors.projectStatus
                        }>
                        <option value={-1}>------</option>
                        <option value='1'>Registro</option>
                        <option value='2'>Diseño</option>
                        <option value='3'>Finalizado</option>
                      </Form.Control>
                      <Form.Control.Feedback type='invalid'>
                        {errors.projectStatus}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={this.handleClose}>
                  Cancelar
                </Button>
                <Button form='formUpdateProject' type='submit'>
                  Actualizar proyecto
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

export default UpdateProjectFormik;
