import React, { Component } from 'react';
import axios from 'axios';

import {
  Button,
  Col,
  Form,
  ListGroup,
  Modal,
  Tabs,
  Tab,
  Row
} from 'react-bootstrap';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';

import { getDateFormat } from '../../utils/utils';
import { getHeader } from '../../utils/utils';
import { URL } from '../../utils/URLSever';
import { showAlert } from '../../utils/utils';
import AlertComponent from '../../layout/alert/alert.component';
import UpdateProjectFormik from '../updateProject/updateProject.component';

import * as Yup from 'yup';

import './viewProject.styles.css';

const schema = Yup.object({
  typeStudy: Yup.number().positive('Campo requerido'),
  numParticipants: Yup.number()
    .min(0, 'Debe ser un numero mayor a -1')
    .required('Campo Requerido'),
  autoNum: Yup.number().positive('Campo requerido'),
  blindStudy: Yup.number().positive('Campo requerido'),
  filterAccess: Yup.number().positive('Campo requerido'),
  dataParticipants: Yup.number().positive('Campo requerido'),
  participantsID: Yup.string()
    .test('len', 'Id debe tener máximo 10 caracteres', val => val.length < 11)
    .required('Campo Requerido')
});

export default class ViewProject extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      initialValues: null,
      countQuestionaries: 0,
      countCenters: 0,
      studyInfo: [],
      projectInfo: [1],
      usersInfo: [],
      showMessage: false,
      numMembers: 0,
      numCenters: 0,
      message: false,
      tab: 'home',
      alertVariant: '',
      alertMessage: '',
      alertId: 'alert-viewProject'
    };
  }

  handleOpenUpdate = () => {
    this.setState({ isVisibleUpdate: true });
  };

  /**
   * @function handleCloseUpdate function enviada como prop de un componente.
   * es llamada cuando un usuario es actualizado satisfactoriamente
   */
  handleCloseUpdate = () => {
    this.getProjects();
    this.setState({
      alertVariant: 'success',
      alertMessage: 'Proyecto Actualizado.'
    });
    this.handleClose();
    /*showAlert(this.state.alertId);*/
  };

  getMembers = async () => {
    const headers = getHeader();
    axios
      .get(
        URL + '/studies/user/' + this.props.project + '/',
        { headers: headers },
        { cancelToken: this.source.token }
      )
      .then(response => {
        this.setState({
          membersInfo: response.data,
          numMembers: response.data.length
        });
      })
      .catch(error => {
        console.log(error.status);
      });
  };

  getStudyById = id => {
    const headers = getHeader();
    this.setState({ loading: true }, () =>
      axios
        .get(
          URL + '/studies/' + id,
          { headers: headers },
          { cancelToken: this.source.token }
        )
        .then(response => {
          this.setState(
            {
              studyInfo: response.data,
              loading: false
            },
            () =>
              this.setState({
                initialValues: {
                  is_test: this.state.studyInfo[0].fields.is_studyTest,
                  typeStudy: this.state.studyInfo[0].fields.type_study,
                  numParticipants: this.state.studyInfo[0].fields
                    .num_participants,
                  is_traceability: this.state.studyInfo[0].fields.trazability,
                  is_doubleIn: this.state.studyInfo[0].fields.double_in,
                  is_duplicity: this.state.studyInfo[0].fields.control_double,
                  is_random: this.state.studyInfo[0].fields.is_random,
                  autoNum: this.state.studyInfo[0].fields.autonum,
                  blindStudy: this.state.studyInfo[0].fields.blind_study,
                  is_criterionInclusion: this.state.studyInfo[0].fields
                    .is_criterInclusion,
                  filterAccess: this.state.studyInfo[0].fields.filter_access,
                  dataParticipants: this.state.studyInfo[0].fields
                    .data_participant,
                  is_accessData: this.state.studyInfo[0].fields.is_habeasdata,
                  participantsID: this.state.studyInfo[0].fields.participant_id
                }
              })
          );
        })
        .catch(() => this.setState({ loading: false }))
    );
  };

  updateDesignProject = values => {
    const headers = getHeader();
    const data = {
      study_id: this.props.project,
      study: {
        is_studyTest: values.is_test,
        type_study: values.typeStudy,
        num_participants: values.numParticipants,
        trazability: values.is_traceability,
        double_in: values.is_doubleIn,
        control_double: values.is_duplicity,
        autonum: values.autoNum,
        is_random: values.is_random,
        blind_study: values.blindStudy,
        is_criterInclusion: values.is_criterionInclusion,
        filter_access: values.filterAccess,
        data_participant: values.dataParticipants,
        is_habeasdata: values.is_accessData,
        participant_id: values.participantsID
      }
    };
    axios
      .put(
        URL + '/studies/design/',
        data,
        { headers: headers },
        { cancelToken: this.source.token }
      )
      .then(() => {
        this.setState(
          {
            alertVariant: 'success',
            alertMessage: 'Diseño actualizado'
          },
          () => this.getStudyById(this.props.project)
        );
        showAlert(this.state.alertId);
      })
      .catch(error => console.log(error));
  };

  getCountQuestionaries = () => {
    const headers = getHeader();
    axios
      .get(
        URL + '/questionaries/count/' + this.props.project,
        { headers: headers },
        { cancelToken: this.source.token }
      )
      .then(response => {
        this.setState({ countQuestionaries: response.data });
      })
      .catch(error => {
        console.log(error.status);
      });
  };

  getCountCenters = () => {
    const headers = getHeader();
    axios
      .get(
        URL + '/studies/center/count/' + this.props.project,
        { headers: headers },
        { cancelToken: this.source.token }
      )
      .then(response => {
        this.setState({ countCenters: response.data });
      })
      .catch(error => {
        console.log(error.status);
      });
  };

  renderFormDesign = () => {
    const { studyInfo } = this.state;
    const form = (
      <Formik
        noValidate
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={{
          is_test: studyInfo[0].fields.is_studyTest,
          typeStudy: studyInfo[0].fields.type_study,
          numParticipants: studyInfo[0].fields.num_participants,
          is_traceability: studyInfo[0].fields.trazability,
          is_doubleIn: studyInfo[0].fields.double_in,
          is_duplicity: studyInfo[0].fields.control_double,
          is_random: studyInfo[0].fields.is_random,
          autoNum: studyInfo[0].fields.autonum,
          blindStudy: studyInfo[0].fields.blind_study,
          is_criterionInclusion: studyInfo[0].fields.is_criterInclusion,
          filterAccess: studyInfo[0].fields.filter_access,
          dataParticipants: studyInfo[0].fields.data_participant,
          is_accessData: studyInfo[0].fields.is_habeasdata,
          participantsID: studyInfo[0].fields.participant_id
        }}
        validationSchema={schema}
        onSubmit={this.updateDesignProject}>
        {({
          handleSubmit,
          handleChange,
          values,
          resetForm,
          touched,
          errors
        }) => (
          <>
            <Form id='formCreateProject' onSubmit={handleSubmit}>
              <Form.Row>
                <Form.Group as={Col} md='4' lg='3'>
                  <Form.Check
                    type='checkbox'
                    id='is_test'
                    name='is_test'
                    label='Estudio de pruebas'
                    value={values.is_test}
                    checked={values.is_test}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form.Row>
              <hr />
              <Form.Row>
                <Form.Group as={Col} md='5' lg='3'>
                  <Form.Label>Tipo de estudio</Form.Label>
                  <Form.Control
                    as='select'
                    name='typeStudy'
                    value={values.typeStudy}
                    onChange={handleChange}
                    isValid={touched.typeStudy && !errors.typeStudy}
                    isInvalid={!!errors.typeStudy}>
                    <option value={-1}>---</option>
                    <option value={1}>Estudio observacional</option>
                    <option value={2}>Ensayo clinico</option>
                    <option value={3}>Estudio tipo encuesta</option>
                    <option value={4}>Otros estudios</option>
                  </Form.Control>
                  <Form.Control.Feedback type='invalid'>
                    {errors.typeStudy}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='6' lg='3'>
                  <Form.Label>Numero previsto de participantes</Form.Label>
                  <Form.Control
                    type='number'
                    name='numParticipants'
                    value={values.numParticipants}
                    onChange={handleChange}
                    isValid={touched.numParticipants && !errors.numParticipants}
                    isInvalid={!!errors.numParticipants}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.numParticipants}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <hr />
              <Form.Row>
                <Form.Group as={Col} md='3'>
                  <Form.Check
                    type='checkbox'
                    id='is_traceability'
                    name='is_traceability'
                    label='Trazabilidad de pruebas'
                    value={values.is_traceability}
                    checked={values.is_traceability}
                    onChange={handleChange}
                  />
                  <Form.Check
                    type='checkbox'
                    id='is_doubleIn'
                    name='is_doubleIn'
                    label='Doble entrada'
                    value={values.is_doubleIn}
                    checked={values.is_doubleIn}
                    onChange={handleChange}
                  />
                  <Form.Check
                    type='checkbox'
                    id='is_duplicity'
                    name='is_duplicity'
                    label='Duplicidad'
                    value={values.is_duplicity}
                    checked={values.is_duplicity}
                    onChange={handleChange}
                  />
                  <Form.Check
                    type='checkbox'
                    id='is_random'
                    name='is_random'
                    label='Aleatorización'
                    value={values.is_random}
                    checked={values.is_random}
                    onChange={handleChange}
                    disabled={values.typeStudy > 1 ? false : true}
                  />
                </Form.Group>
                <Form.Group as={Col} md='4'>
                  <Form.Label>Autonumeracion</Form.Label>
                  <Form.Control
                    as='select'
                    name='autoNum'
                    value={values.autoNum}
                    onChange={handleChange}
                    isValid={touched.autoNum && !errors.autoNum}
                    isInvalid={!!errors.autoNum}>
                    <option value={-1}>---</option>
                    <option value={1}>No</option>
                    <option value={2}>No, por centro</option>
                    <option value={3}>Si</option>
                    <option value={4}>Si, por centro</option>
                  </Form.Control>
                  <Form.Control.Feedback type='invalid'>
                    {errors.autoNum}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='4'>
                  <Form.Label>Estudio ciego</Form.Label>
                  <Form.Control
                    as='select'
                    name='blindStudy'
                    value={values.blindStudy}
                    onChange={handleChange}
                    disabled={
                      values.is_random === true && values.typeStudy > 1
                        ? false
                        : true
                    }
                    isValid={touched.blindStudy && !errors.blindStudy}
                    isInvalid={!!errors.blindStudy}>
                    <option value={-1}>---</option>
                    <option value={1}>No</option>
                    <option value={2}>Ciego</option>
                    <option value={3}>Doble ciego</option>
                    <option value={4}>Triple ciego</option>
                  </Form.Control>
                  <Form.Control.Feedback type='invalid'>
                    {errors.blindStudy}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <hr />
              <Form.Row>
                <Form.Group as={Col} md='3'>
                  <Form.Check
                    type='checkbox'
                    id='is_criterionInclusion'
                    name='is_criterionInclusion'
                    label='Criterio de inclusion'
                    value={values.is_criterionInclusion}
                    checked={values.is_criterionInclusion}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md='4'>
                  <Form.Label>Filtro de acceso</Form.Label>
                  <Form.Control
                    as='select'
                    name='filterAccess'
                    value={values.filterAccess}
                    onChange={handleChange}
                    isValid={touched.filterAccess && !errors.filterAccess}
                    isInvalid={!!errors.filterAccess}>
                    <option value={-1}>---</option>
                    <option value={1}>Por centros</option>
                    <option value={2}>Por categorias</option>
                    <option value={3}>Sin filtro</option>
                  </Form.Control>
                  <Form.Control.Feedback type='invalid'>
                    {errors.filterAccess}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='4'>
                  <Form.Label>Datos participantes</Form.Label>
                  <Form.Control
                    as='select'
                    name='dataParticipants'
                    value={values.dataParticipants}
                    onChange={handleChange}
                    disabled={values.is_duplicity === false ? true : false}
                    isValid={
                      touched.dataParticipants && !errors.dataParticipants
                    }
                    isInvalid={!!errors.dataParticipants}>
                    <option value={-1}>---</option>
                    <option value={1}>No</option>
                    <option value={2}>Si</option>
                    <option value={3}>Si y obligatorio</option>
                  </Form.Control>
                  <Form.Control.Feedback type='invalid'>
                    {errors.dataParticipants}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <hr />
              <Form.Row>
                <Form.Group as={Col} md='3'>
                  <Form.Check
                    type='checkbox'
                    id='is_accessData'
                    name='is_accessData'
                    label='Acceso a datos personales'
                    value={values.is_accessData}
                    checked={values.is_accessData}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md='5' lg='2'>
                  <Form.Label>Participantes ID</Form.Label>
                  <Form.Control
                    type='text'
                    name='participantsID'
                    value={values.participantsID}
                    onChange={handleChange}
                    disabled={values.is_accessData === false ? true : false}
                    isValid={touched.participantsID && !errors.participantsID}
                    isInvalid={!!errors.participantsID}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.participantsID}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <hr />
              <div className='row d-flex justify-content-center'>
                <div className=''>
                  <Button
                    className='mr-1'
                    variant='secondary'
                    onClick={() => resetForm(this.state.initialValues)}>
                    Restaurar
                  </Button>
                  <Button className='ml-1' type='submit'>
                    Guardar
                  </Button>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    );
    return form;
  };

  componentDidMount() {
    this.getStudyById(this.props.project);
    this.getMembers();
    this.getCountQuestionaries();
    this.getCountCenters();
  }

  render() {
    const { studyInfo } = this.state;
    return (
      <>
        {this.state.loading ? (
          <Loader
            type='ThreeDots'
            height={100}
            width={100}
            color='#00BFFF'
            timeout={3000}
            className='mh'
          />
        ) : studyInfo.length > 0 ? (
          <Tabs
            defaultActiveKey={this.state.tab}
            id='uncontrolled-tab-example'
            onSelect={e => this.setState({ tab: e })}>
            <Tab eventKey='home' title='Información'>
              <div className='container p-3'>
                <Row>
                  <h5 className='text-center w-100 strong'>
                    Información general del proyecto
                  </h5>
                </Row>
                <Row>
                  <Col className='mb-2' xs='12' sm='6' md='5' lg='4'>
                    <h6 className='strong'>Detalles:</h6>
                    <span className='cap'>
                      Nombre: {studyInfo[0].fields.title_little}
                    </span>
                    <br />
                    <span>Código: {studyInfo[0].fields.study_id}</span>
                    <br />
                    <span>
                      Fecha de registro:{' '}
                      {getDateFormat(studyInfo[0].fields.date_reg)}
                    </span>
                    <br />
                    <span>
                      Fecha de inicio:{' '}
                      {getDateFormat(studyInfo[0].fields.date_in_study)}
                    </span>{' '}
                    <br />
                    <span>
                      Fecha de finalización:{' '}
                      {getDateFormat(studyInfo[0].fields.date_trueaout_end)}
                    </span>
                  </Col>
                  <Col className='mb-2' xs='12' sm='6' md='4' lg='3'>
                    <h6 className='strong'>Componentes:</h6>
                    <Link
                      className='btIntegrantes'
                      to={'/admin/studies/members/' + this.props.project}>
                      Integrantes
                      <br />
                      <span>[{this.state.numMembers}]</span>
                    </Link>
                    <Link
                      className='btn-questionaries'
                      to={'/admin/questionaries/' + this.props.project}>
                      Cuestionarios
                      <br />
                      <span>[{this.state.countQuestionaries}]</span>
                    </Link>
                    <Link
                      className='btCentros'
                      to={'/admin/centers/' + this.props.project}>
                      Centros
                      <br />
                      <span>[{this.state.countCenters}]</span>
                    </Link>
                  </Col>
                </Row>
                <Row>
                  <Col className='mb-2' md='6'>
                    <h6 className='strong'>Estado:</h6>
                    <ListGroup horizontal={'sm'}>
                      <ListGroup.Item variant='danger'>Diseño</ListGroup.Item>
                      <ListGroup.Item variant='light'>Registro</ListGroup.Item>
                      <ListGroup.Item variant='light'>Analisis</ListGroup.Item>
                    </ListGroup>
                  </Col>
                </Row>
              </div>
            </Tab>
            <Tab eventKey='profile' title='Diseño'>
              <div className='container p-3'>
                <this.renderFormDesign />
              </div>
            </Tab>
          </Tabs>
        ) : (
          <h4>El proyecto no existe</h4>
        )}
        <AlertComponent
          alertId={this.state.alertId}
          alertVariant={this.state.alertVariant}
          alertMessage={this.state.alertMessage}
        />
      </>
    );
  }
}
