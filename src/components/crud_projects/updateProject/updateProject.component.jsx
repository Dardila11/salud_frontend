import React, { Component } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { URL } from '../../utils/URLSever';
import { Button, Modal, Form, Col } from 'react-bootstrap';
import DatePicker, { registerLocale } from 'react-datepicker';
import AlertComponent from '../../layout/alert/alert.component';
import * as Yup from 'yup';
import * as Utils from '../../utils/utils';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
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
      'Debe tener exactamente 10 caracteres',
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
  endDate: Yup.date().when(
    'startDate',
    (startDate, schema) => startDate && schema.min(startDate)
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
  updateProjectInfo = async values => {
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
        principal_inv: values.principalInvestigator,
        manager_1: null,
        manager_2: null
      }
    };
    var myJson = JSON.stringify(json);
    console.log(myJson);
    axios
      .put(URL + '/studies/', json, { headers: headers })
      .then(response => {
        console.log(response.status);
        this.handleCloseUpdate();
      })
      .catch(error => {
        console.log('hubo un error!');
        console.log(error.status);
        this.setState({
          alertVariant: 'danger',
          alertMessage: JSON.parse(error.request.response).detail
        });
        Utils.showAlert(this.state.alertId);
      });
  };
  render() {
    return (
      <>
        <Formik
          noValidate
          enableReinitialize
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{
            projectStatus: this.props.projectInfo[0].fields.status,
            projectId: this.props.projectInfo[0].fields.study_id,
            title: this.props.projectInfo[0].fields.title_little,
            /*  GMT-5 zona horaria de Colombia */
            registerDate: new Date(
              this.props.projectInfo[0].fields.date_reg.substring(0, 10)
            ),
            startDate: new Date(
              this.props.projectInfo[0].fields.date_in_study
            ),
            endDate: new Date(
              this.props.projectInfo[0].fields.date_trueaout_end
            ),
            principalInvestigator: this.props.projectInfo[0].fields
              .principal_inv,
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
            isValid,
            setFieldValue,
            errors
          }) => (
            <>
              <Modal.Header closeButton>
                <Modal.Title className='h3 text-gray-800 mb-0'>
                  Actualizar Proyecto
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
                      <DatePicker
                        selected={values.registerDate}
                        dateFormat='yyyy-MM-dd'
                        disabled
                        locale='es'
                        className='form-control'
                        name='registerDate'
                        onChange={date => setFieldValue('registerDate', date)}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.registerDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='4' controlId='inputId'>
                      <Form.Label>Fecha Inicio </Form.Label>
                      <DatePicker
                        selectsStart
                        selected={values.startDate}
                        endDate={values.endDate}
                        dateFormat='yyyy-MM-dd'
                        placeholderText='Fecha inicio'
                        locale='es'
                        className='form-control'
                        name='startDate'
                        onChange={date => setFieldValue('startDate', date)}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.startDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='4' controlId='inputId'>
                      <Form.Label>Fecha Finalización </Form.Label>
                      <DatePicker
                        selected={values.endDate}
                        startDate={values.startDate}
                        minDate={values.startDate}
                        dateFormat='yyyy-MM-dd'
                        placeholderText='Fecha Final'
                        locale='es'
                        className='form-control'
                        name='endDate'
                        onChange={date => setFieldValue('endDate', date)}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.endDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    {/*<Form.Group as={Col} md='4' controlId='inputId'>
                      <Form.Label>Responsable principal</Form.Label>
                      <Autosuggest
                        multiSection={true}
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={
                          this.onSuggestionsFetchRequested
                        }
                        onSuggestionsClearRequested={
                          this.onSuggestionsClearRequested
                        }
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        renderSectionTitle={renderSectionTitle}
                        getSectionSuggestions={getSectionSuggestions}
                        inputProps={inputProps}
                        theme={theme}
                      />
                      
                    </Form.Group>*/}
                    <Form.Group as={Col} md='4' controlId='inputId'>
                      <Form.Label>Responsable del Registro </Form.Label>
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
                    <Form.Group as={Col} md='4' controlId='inputId'>
                      <Form.Label>Investigador Principal </Form.Label>
                      <Form.Control
                        as='select'
                        name='principalInvestigator'
                        value={values.principalInvestigator}
                        onChange={handleChange}
                        required
                        isInvalid={!!errors.principalInvestigator}
                        isValid={
                          touched.principalInvestigator &&
                          !errors.principalInvestigator
                        }>
                        <option value={-1}>------</option>
                        {this.props.usersInfo.map((option, index) => {
                          return (
                            <option key={index} value={option.userId}>
                              {option.userName} | {option.userEmail}
                            </option>
                          );
                        })}
                      </Form.Control>
                      <Form.Control.Feedback type='invalid'>
                        {errors.myCenter}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='4' controlId='inputId'>
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
                  Actualizar Proyecto
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
