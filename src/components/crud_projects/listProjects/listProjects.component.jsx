import React, { Component } from 'react';
import axios from 'axios';
import { Modal, Alert, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ReactTable from 'react-table';
import Loader from 'react-loader-spinner';
/**
 * hallar mejor forma para colocar en mayuscula la primera letra
 */
import Capitalize from 'react-capitalize';
import AlertComponent from '../../layout/alert/alert.component';
import CreateProjectFormik from '../createProject/createProject.component';
import UpdateProjectFormik from '../updateProject/updateProject.component';
import DeleteProject from '../deleteProject/deleteProject.component';

import { getHeader, showAlert } from '../../utils/utils';
import { URL } from '../../utils/URLSever';

import 'react-table/react-table.css';
import './listProjects.styles.css';

/**
 * @function NoDataConst
 * @description se encarga de mostrar el spinner de carga
 */
const NoDataConst = () => (
  <Loader
    type='ThreeDots'
    height={100}
    width={100}
    color='#00BFFF'
    timeout={3000}
    className='mh -loading -active'
  />
);
class ListProjects extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();
  typeModal = 0;
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      idProjectToEdit: -1,
      projectInfo: [1],
      info: [],
      projectsInfo: [],
      usersInfo: [],
      isVisibleCreate: false,
      isVisibleUpdate: false,
      isVisibleDelete: false,
      isVisibleView: false,
      showMessage: false,
      message: false,
      alertVariant: '',
      alertMessage: '',
      alertId: 'alert-listProjects',
      /* En este caso, el accessor es la variable del array projectsInfoArray */
      columns: [
        {
          Header: 'Título',
          accessor: 'title',
          width: 150,
          maxWidth: 200,
          minWidth: 100
        },
        {
          Header: 'Fecha de Registro',
          accessor: 'reg_date',
          width: 150,
          maxWidth: 200,
          minWidth: 100
        },
        {
          Header: 'Fecha de Inicio',
          accessor: 'start_date',
          width: 150,
          maxWidth: 200,
          minWidth: 100
        },
        {
          Header: 'Fecha de Finalización',
          accessor: 'end_date',
          width: 150,
          maxWidth: 200,
          minWidth: 100
        },
        //ahorrando espacio
        /*
        {
          Header: 'Responsable del registro',
          accessor: 'reg_responsible',
          width: 150,
          maxWidth: 200,
          minWidth: 100
        },
        
        {
          Header: 'Investigador Principal',
          accessor: 'principal_investigator',
          sortable: false,
          filterable: false,
          width: 100,
          maxWidth: 100,
          minWidth: 100
        },*/
        {
          id: 'status',
          Header: 'Estado',
          accessor: d => {
            switch (d.status) {
              case 1:
                return 'Registro';
              case 2:
                return 'Diseño';
              case 3:
                return 'Finalizado';
            }
          },
          sortable: false,
          filterable: false,
          width: 150,
          maxWidth: 150,
          minWidth: 100
        },
        {
          id: 'is_active',
          Header: 'Activo',
          accessor: 'is_active',
          sortable: false,
          filterable: false,
          width: 150,
          maxWidth: 150,
          minWidth: 100,
          Cell: props => {
            return props.value ? (
              <div className='success'></div>
            ) : (
              <div className='remove'></div>
            );
          }
        },
        {
          Header: 'Acciones',
          sortable: false,
          filterable: false,
          width: 250,
          maxWidth: 250,
          minWidth: 200,
          Cell: props => {
            return (
              <>
                <OverlayTrigger
                  placement='right'
                  delay={{ show: 250, hide: 100 }}
                  overlay={<Tooltip>Actualizar</Tooltip>}>
                  <Button
                    className='update'
                    variant='outline-primary'
                    onClick={() => {
                      this.updateRow(props.original.id_pk);
                    }}
                  />
                </OverlayTrigger>
                <OverlayTrigger
                  placement='right'
                  delay={{ show: 250, hide: 100 }}
                  overlay={<Tooltip>Detalles</Tooltip>}>
                  <Button
                    className='ml-1 view'
                    variant='outline-primary'
                    onClick={() => {
                      this.viewRow(props.original.id_pk);
                    }}
                  />
                </OverlayTrigger>
                <OverlayTrigger
                  placement='right'
                  delay={{ show: 250, hide: 100 }}
                  overlay={<Tooltip>Estado</Tooltip>}>
                  <Button
                    className='ml-1 change'
                    variant='outline-primary'
                    onClick={() => {
                      this.deleteRow(props.original.id_pk);
                    }}
                  />
                </OverlayTrigger>
              </>
            );
          }
        }
      ]
    };
  }

  componentDidMount() {
    this.getUsers();
    this.getProjects();
  }

  componentWillUnmount() {
    this.source.cancel('cancel request');
  }

  /**
   * todos los handleShow, create, update, view, delete
   * se encargan de cambiar el estado del correspondiente variable
   */
  handleOpenCreate = () => {
    this.setState({ isVisibleCreate: true });
  };

  handleOpenUpdate = () => {
    this.setState({ isVisibleUpdate: true });
  };

  handleOpenDelete = () => {
    this.setState({ isVisibleDelete: true });
  };
  handleOpenView = () => {
    this.setState({ isVisibleView: true });
  };
  /**
   * @function handleClose se encarga de resetar los valores de las alertas
   * y finaliza actualizando nuevamente los usuarios.
   * @todo deberia solamente actualizar los usuarios
   *      cuando son creados, actualizados o borrados
   */
  handleClose = () => {
    this.getProjects();
    this.setState({
      isVisibleCreate: false,
      isVisibleUpdate: false,
      isVisibleDelete: false,
      isVisibleView: false
    });
  };
  /**
   * @function handleCloseCreate function enviada como prop de un componente.
   * es llamada cuando un proyecto es creado satisfactoriamente
   */
  handleCloseCreate = () => {
    this.setState({
      alertVariant: 'success',
      alertMessage: 'Proyecto creado.'
    });
    this.handleClose();
    showAlert(this.state.alertId);
  };

  /**
   * @function handleCloseUpdate function enviada como prop de un componente.
   * es llamada cuando un usuario es actualizado satisfactoriamente
   */
  handleCloseUpdate = () => {
    this.setState({
      alertVariant: 'success',
      alertMessage: 'Proyecto Actualizado.'
    });
    this.handleClose();
    showAlert(this.state.alertId);
  };

  handleCloseDelete = () => {
    this.setState({
      alertVariant: 'success',
      alertMessage: 'Estado del proyecto modificado.'
    });
    this.handleClose();
    showAlert(this.state.alertId);
  };

  /**
   * @function getUsers
   * @description Realiza una peticion al servidor el cual obtiene todos los
   * usuarios que existen.
   *
   * @todo agregar el evento de error
   */
  getUsers = async () => {
    const headers = getHeader();
    axios
      .get(
        URL + '/users/all/',
        { headers: headers },
        { cancelToken: this.source.token }
      )
      .then(response => {
        this.setState({ info: response.data }, () => {
          this.getUsersInfo();
        });
      })
      .catch(error => {
        console.log('oh no, hubo un error!');
        console.log(error.status);
      });
  };

  getProjects = async () => {
    const headers = getHeader();
    this.setState({ loading: true }, () => {
      axios
        .get(
          URL + '/studies/all/',
          { headers: headers },
          { cancelToken: this.source.token }
        )
        .then(response => {
          this.setState({ projectsInfo: response.data, loading: false }, () => {
            this.getProjectsInfo();
          });
        })
        .catch(error => {
          console.log('oh no, hubo un error!');
          console.log(error.status);
        });
    });
  };

  getProjectsInfo = () => {
    var projectsInfoArray = [];
    for (let i = 0; i < this.state.projectsInfo.length; i++) {
      var id = this.state.projectsInfo[i].id;
      var title = this.state.projectsInfo[i].title_little;
      var reg_date = this.state.projectsInfo[i].date_reg.substring(0, 10);
      var start_date = this.state.projectsInfo[i].date_in_study;
      var end_date = this.state.projectsInfo[i].date_trueaout_end;
      var status = this.state.projectsInfo[i].status;
      var reg_responsible = this.state.projectsInfo[i].manager_reg__first_name;
      var principal_investigator = this.state.projectsInfo[i]
        .principal_inv__first_name;
      var is_active = this.state.projectsInfo[i].is_active;
      projectsInfoArray.push({
        id_pk: id,
        title: title,
        reg_date: reg_date,
        start_date: start_date,
        end_date: end_date,
        status: status,
        reg_responsible: reg_responsible,
        principal_investigator: principal_investigator,
        is_active: is_active
      });
      console.log(title);
    }
    this.setState({ projectsInfo: projectsInfoArray });
  };

  getUsersInfo = () => {
    var usersInfoArray = [];
    for (let i = 0; i < this.state.info.length; i++) {
      var email = this.state.info[i].email;
      var firstName = this.state.info[i].first_name;
      var lastName = this.state.info[i].last_name;
      var id = this.state.info[i].id;
      usersInfoArray.push({
        userEmail: email,
        userName: firstName + ' ' + lastName,
        userId: id
      });
    }
    /* usersInfoArray.map(user => {
      console.log(user.userEmail + ' ' + user.userName);
    }); */
    this.setState({ usersInfo: usersInfoArray });
  };

  getProjectById = async id => {
    const headers = getHeader();
    axios
      .get(
        URL + '/studies/' + id,
        { headers: headers },
        { cancelToken: this.source.token }
      )
      .then(response => {
        this.setState({ projectInfo: response.data }, () => {
          console.log(
            'obteniendo la informacion del proyecto. ' +
              this.state.projectInfo[0].fields.is_active
          );
          if (this.typeModal === 0) {
            this.handleOpenUpdate();
          } else if (this.typeModal === 1) {
            this.handleOpenView();
          } else if (this.typeModal === 2) {
            this.handleOpenDelete();
          }
          this.typeModal = 0;
        });
      })
      .catch(error => {
        console.log('oh no, hubo un error!');
        console.log(error.status);
      });
  };

  /**
   * @function updateRow
   * @description Se encarga de mostrar el modal de actualizacion de proyecto y cargar la informacion
   * del proyecto (su id)
   */
  updateRow = id => {
    this.typeModal = 0;
    this.setState({ idProjectToEdit: id }, () => {
      this.getProjectById(this.state.idProjectToEdit);
    });
  };

  viewRow = id => {
    this.typeModal = 1;
    this.setState({ idProjectToEdit: id }, () => {
      this.getProjectById(this.state.idProjectToEdit);
    });
  };

  deleteRow = id => {
    this.typeModal = 2;
    this.setState({ idProjectToEdit: id }, () => {
      this.getProjectById(this.state.idProjectToEdit);
    });
  };

  render() {
    return (
      <>
        <h1 className='h3 mb-2 text-gray-800'>Lista de proyectos</h1>
        <button
          className='btn btn-primary btn-icon-split p-0 mb-2'
          onClick={this.handleOpenCreate}>
          <span className='icon text-white-50'>
            <i className='fas fa-plus-square'></i>
          </span>
          <span className='text text-white'>Crear proyecto</span>
        </button>
        {this.state.loading ? (
          <ReactTable
            columns={this.state.columns}
            defaultPageSize={6}
            NoDataComponent={NoDataConst}
            noDataText={'No existen proyectos'}
            filterable
          />
        ) : (
          <ReactTable
            columns={this.state.columns}
            data={this.state.projectsInfo}
            defaultPageSize={6}
            NoDataComponent={NoDataConst}
            noDataText={'No existen proyectos'}
            filterable
          />
        )}

        <Modal
          size='lg'
          show={this.state.isVisibleCreate}
          onHide={this.handleClose}>
          {/* Crear Proyecto */}
          <CreateProjectFormik
            usersInfo={this.state.usersInfo}
            handleCloseCreate={this.handleCloseCreate}
            handleClose={this.handleClose}
          />
        </Modal>
        <Modal show={this.state.isVisibleUpdate} onHide={this.handleClose}>
          {/* Actualizar Proyecto */}
          <UpdateProjectFormik
            handleCloseUpdate={this.handleCloseUpdate}
            handleClose={this.handleClose}
            usersInfo={this.state.usersInfo}
            projectInfo={this.state.projectInfo}
          />
        </Modal>
        <Modal show={this.state.isVisibleView} onHide={this.handleClose}>
          {/* Ver Proyecto */}
          {/* <ViewProjectFormik
            handleCloseUpdate={this.handleCloseUpdate}
            handleClose={this.handleClose}
            email={this.state.emailToEdit}
            usersInfo={this.state.usersInfo}
            projectInfo={this.state.projectInfo}
          /> */}
        </Modal>
        <Modal show={this.state.isVisibleDelete} onHide={this.handleClose}>
          {/* Eliminar Proyecto */}
          <DeleteProject
            handleCloseDelete={this.handleCloseDelete}
            handleClose={this.handleClose}
            projectId={this.state.idProjectToEdit}
            is_active={this.state.projectInfo}
          />
        </Modal>
        <AlertComponent
          alertId={this.state.alertId}
          alertVariant={this.state.alertVariant}
          alertMessage={this.state.alertMessage}
        />
      </>
    );
  }
}

export default ListProjects;
