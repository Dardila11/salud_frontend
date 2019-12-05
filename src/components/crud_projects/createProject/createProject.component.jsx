import React, { Component } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { URL } from '../../utils/URLSever';
import { Button, Modal, Form, Col } from 'react-bootstrap';
import * as Yup from 'yup';
//import Autosuggest from 'react-autosuggest';
//import theme from './theme.css';
import DatePicker, { registerLocale } from 'react-datepicker';
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
  principalInvestigator: Yup.string().required('Campo Requerido'),
  responsibleInvestigator: Yup.string().required('Campo Requerido')
});

const theme = {
  container: {
    position: 'relative'
  },
  input: {
    width: 240,
    height: 30,
    padding: '10px 20px',
    fontFamily: 'Helvetica, sans-serif',
    fontWeight: 300,
    fontSize: 16,
    border: '1px solid #aaa',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4
  },
  inputFocused: {
    outline: 'none'
  },
  inputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  suggestionsContainer: {
    display: 'none'
  },
  suggestionsContainerOpen: {
    display: 'block',
    position: 'absolute',
    top: 51,
    width: 280,
    border: '1px solid #aaa',
    backgroundColor: '#fff',
    fontFamily: 'Helvetica, sans-serif',
    fontWeight: 300,
    fontSize: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    zIndex: 2
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },
  suggestion: {
    cursor: 'pointer',
    padding: '10px 20px'
  },
  suggestionHighlighted: {
    backgroundColor: '#ddd'
  }
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.userName;

function getSectionSuggestions(section) {
  return section.userName;
}

function renderSuggestion(suggestion) {
  return <span>{suggestion.userName}</span>;
}

function renderSectionTitle(section) {
  return <strong>{section.userEmail}</strong>;
}

/**
 * @author Dardila
 * @description Este componente se encarga de la creacion de nuevos
 * proyectos de estudios
 */

/**
 * @todo
 * TODO: Las Fechas no las obtiene bien, da un dia menos.
 * Falta validacion de fechas
 */
class CreateProjectFormik extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: []
    };
  }

  handleClose = () => {
    this.props.handleClose();
  };
  handleCloseCreate = () => {
    this.props.handleCloseCreate();
  };

  genId = length => {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  escapeRegexCharacters = str => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };
  // Teach Autosuggest how to calculate suggestions for any given input value.
  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const escapedValue = this.escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    if (escapedValue === '') {
      return [];
    }

    return this.props.projectsInfo
      .map(section => {
        console.log('EMAIL ' + section.userEmail);
        return {
          userEmail: section.userEmail,
          userName: section.userName.filter(sec => regex.test(sec.name))
        };
      })
      .filter(section => section.userName.length > 0);
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  saveNewProjectInfo = async values => {
    var token = JSON.parse(localStorage.getItem('token'));

    var json = {
      study: {
        study_id: values.projectId,
        title_little: values.title,
        title_long: values.title,
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
        principal_inv: values.principalInvestigator,
        manager_1: null,
        manager_2: null
      }
    };
    var myJson = JSON.stringify(json);
    console.log(myJson);
    /**
     * headers: son necesarios para realizar la
     * solicitud al servidor. se le envia el JWT y
     * el token como autorización
     */

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + token
    };
    axios
      .post(URL + '/studies/', json, {
        headers: headers
      })
      .then(response => {
        console.log(response.status);
        this.handleCloseCreate();
      })
      .catch(error => {
        console.log('hubo un error');
        console.log(error.status);
      });
  };
  render() {
    //const { value, suggestions } = this.state;
    // Autosuggest will pass through all these props to the input.
    /* const inputProps = {
      placeholder: 'Investigador Responsable',
      value,
      onChange: this.onChange
    }; */
    return (
      <>
        <Formik
          noValidate
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{
            projectId: this.genId(10),
            title: '',
            registerDate: new Date(),
            startDate: new Date(),
            endDate: new Date(),
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
            handleBlur,
            values,
            touched,
            isValid,
            errors,
            setFieldValue
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
      </>
    );
  }
}

export default CreateProjectFormik;
