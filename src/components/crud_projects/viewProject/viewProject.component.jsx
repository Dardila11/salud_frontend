import React, { Component } from 'react';
import axios from 'axios';

import { Button, ListGroup, Modal, Row, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';

import { getDateFormat } from '../../utils/utils';
import { getHeader } from '../../utils/utils';
import { URL } from '../../utils/URLSever';
import AlertComponent from '../../layout/alert/alert.component';
import UpdateProjectFormik from '../updateProject/updateProject.component';

import './viewProject.styles.css';

export default class ViewProject extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      studyInfo: [],
      projectInfo: [1],
      usersInfo: [],
      showMessage: false,
      numMembers: 0,
      numCenters: 0,
      message: false,
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
          this.setState({
            studyInfo: response.data,
            loading: false
          });
        })
        .catch(() => this.setState({ loading: false }))
    );
  };

  componentDidMount() {
    this.getStudyById(this.props.project);
    this.getMembers();
  }

  render() {
    const { studyInfo } = this.state;
    return (
      <>
        {console.log(this.state.studyInfo[0])}
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
          <Tab.Container defaultActiveKey='#general'>
            <Row>
              <ListGroup horizontal>
                <ListGroup.Item
                  action={true}
                  href='#general'
                  className='no-border-bottom'>
                  General
                </ListGroup.Item>
                <ListGroup.Item
                  action={true}
                  href='#design'
                  className='no-border-bottom'>
                  Diseño
                </ListGroup.Item>
              </ListGroup>
            </Row>
            <Row >
              <Tab.Content className='border-container'>
                <Tab.Pane eventKey='#general'>
                  <div className='container p-3'>
                    <div className='row'>
                      <h5 className='text-center w-100 strong'>
                        Información general del proyecto
                      </h5>
                    </div>
                    <div className='row'>
                      <div className='mb-2  col-md-7 col-xs-12'>
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
                        <br />
                        <Button
                          href='#'
                          className='update'
                          variant='outline-primary'
                          /*onClick={() => {
                              this.updateRow(props.original.id_pk);*/
                        />
                        <Modal
                          size='lg'
                          show={this.state.isVisibleUpdate}
                          onHide={this.handleClose}>
                          {/* Actualizar Proyecto */}
                          <UpdateProjectFormik
                            handleCloseUpdate={this.handleCloseUpdate}
                            handleClose={this.handleClose}
                            usersInfo={this.state.usersInfo}
                            projectInfo={this.state.projectInfo}
                          />
                        </Modal>
                      </div>
                      <div className='col-md-5 mb-2 col-xs-12'>
                        <h6 className='strong'>Componentes:</h6>
                        <Link
                          className='btIntegrantes'
                          to={'/admin/studies/members/' + this.props.project}>
                          Integrantes
                          <br />
                          <span>[{this.state.numMembers}]</span>
                        </Link>
                        <div className='clearfix'></div>
                        <a href='#' className='btCentros'>
                          Centros
                          <br />
                          <span>[5]</span>
                        </a>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='mb-2 col-md-12'>
                        <h6 className='strong'>Estado:</h6>
                        <ListGroup horizontal={'sm'}>
                          <ListGroup.Item variant='danger'>
                            Diseño
                          </ListGroup.Item>
                          <ListGroup.Item variant='light'>
                            Registro
                          </ListGroup.Item>
                          <ListGroup.Item variant='light'>
                            Analisis
                          </ListGroup.Item>
                        </ListGroup>
                      </div>
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey='#design'>
                  <div className='viewContainer'>
                    Este contenido no se encuentra disponible
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Row>
          </Tab.Container>
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
