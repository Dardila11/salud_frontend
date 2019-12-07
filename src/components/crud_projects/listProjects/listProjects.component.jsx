import React, { Component } from 'react';
import axios from 'axios';
import { Modal, Alert, Button } from 'react-bootstrap';
import ReactTable from 'react-table';
import { URL } from '../../utils/URLSever';
import CreateProjectFormik from '../createProject/createProject.component';
import UpdateProjectFormik from '../updateProject/updateProject.component';

import 'react-table/react-table.css';
import './listProjects.styles.css';

var modalUpdate = false;
class ListProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idProjectToEdit: -1,
      projectInfo: [1],
      info: [],
      projectsInfo: [],
      usersInfo: [],
      showCreate: false,
      showUpdate: false,
      showDelete: false,
      showView: false,
      showMessage: false,
      message: false
    };
  }

  componentDidMount() {
    this.getUsers();
    this.getProjects();
  }

  /**
   * todos los handleShow, create, update, view, delete
   * se encargan de cambiar el estado del correspondiente variable
   */
  handleCreate = () => {
    this.setState({ showCreate: true });
  };

  handleUpdate = () => {
    this.setState({ showUpdate: true });
  };
  /**
   * @function handleClose se encarga de resetar los valores de las alertas
   * y finaliza actualizando nuevamente los usuarios.
   * @todo deberia solamente actualizar los usuarios
   *      cuando son creados, actualizados o borrados
   */
  handleClose = () => {
    this.setState(
      {
        showAlert: false,
        showCreate: false,
        showUpdate: false,
        showDelete: false,
        showView: false
      },
      () => {
        console.log('se actualizan los usuarios nuevamente');
        this.getProjects();
      }
    );
  };
  /**
   * @function handleCloseCreate function enviada como prop de un componente.
   * es llamada cuando un usuario es creado satisfactoriamente
   */
  handleCloseCreate = () => {
    this.setState({ showMessage: true, message: 'Proyecto Creado' });
    this.handleClose();
  };

  /**
   * @function handleCloseUpdate function enviada como prop de un componente.
   * es llamada cuando un usuario es actualizado satisfactoriamente
   */
  handleCloseUpdate = () => {
    this.setState({ showMessage: true, message: 'Proyecto Actualizado' });
    this.handleClose();
  };

  handleDismiss = () => {
    this.setState({ showMessage: false });
  };
  /**
   * @function getUsers
   * @description Realiza una peticion al servidor el cual obtiene todos los
   * usuarios que existen.
   *
   * @todo agregar el evento de error
   */
  getUsers = async () => {
    const token = JSON.parse(localStorage.getItem('token'));
    axios
      .get(URL + '/users/all/', {
        headers: {
          Authorization: 'JWT ' + token
        }
      })
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
    const token = JSON.parse(localStorage.getItem('token'));
    axios
      .get(URL + '/studies/all/', {
        headers: {
          Authorization: 'JWT ' + token
        }
      })
      .then(response => {
        this.setState({ projectsInfo: response.data }, () => {
          this.getProjectsInfo();
        });
      })
      .catch(error => {
        console.log('oh no, hubo un error!');
        console.log(error.status);
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
    usersInfoArray.map(user => {
      console.log(user.userEmail + ' ' + user.userName);
    });
    this.setState({ usersInfo: usersInfoArray });
  };

  getProjectById = async id => {
    var token = JSON.parse(localStorage.getItem('token'));
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + token
    };
    axios
      .get(URL + '/studies/' + id, {
        headers: headers
      })
      .then(response => {
        this.setState({ projectInfo: response.data }, () => {
          if (modalUpdate) {
            this.handleUpdate();
          }
          modalUpdate = false;
        });
      })
      .catch(error => {
        console.log('oh no, hubo un error!');
        console.log(error.status);
      });
  };

  /**
   * @function updateRow
   * @description Se encarga de mostrar el modal de actualizacion de usuario y cargar la informacion
   * del usuario (su email)
   */
  updateRow = id => {
    modalUpdate = true;
    this.setState({ idProjectToEdit: id }, () => {
      this.getProjectById(this.state.idProjectToEdit);
    });
  };

  render() {
    /* En este caso, el accessor es la variable del array projectsInfoArray */
    const columns = [
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
      },
      {
        id: 'status',
        Header: 'Estado',
        accessor: d => {
          switch (d.status) {
            case 1:
              return 'REGISTRO';
            case 2:
              return 'DISEÑO';
            case 3:
              return 'FINALIZADO';
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
        accessor: d => {
          return d.is_active ? 'Si' : 'No';
        },
        sortable: false,
        filterable: false,
        width: 150,
        maxWidth: 150,
        minWidth: 100
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
              <Button
                onClick={() => {
                  console.log(props.original.id_pk);
                  this.updateRow(props.original.id_pk);
                }}>
                Editar
              </Button>
              <Button
                className='ml-1'
                onClick={() => {
                  console.log(props.original.id);
                  this.viewRow(props.original.id);
                }}>
                Ver
              </Button>
              <Button
                className='ml-1'
                onClick={() => {
                  this.deleteRow(props.original.id);
                }}>
                Eliminar
              </Button>
            </>
          );
        }
      }
    ];
    return (
      <>
        <h1 className='h3 mb-2 text-gray-800'>Lista de proyectos</h1>
        <button
          className='btn btn-primary btn-icon-split p-0 mb-2'
          onClick={this.handleCreate}>
          <span className='icon text-white-50'>
            <i className='fas fa-plus-square'></i>
          </span>
          <span className='text text-white'>Crear proyecto</span>
        </button>
        <ReactTable
          columns={columns}
          data={this.state.projectsInfo}
          defaultPageSize={6}
          noDataText={'No existen proyectos'}
          filterable></ReactTable>

        <Modal size='lg' show={this.state.showCreate} onHide={this.handleClose}>
          {/* Crear Estudio */}
          <CreateProjectFormik
            usersInfo={this.state.usersInfo}
            handleCloseCreate={this.handleCloseCreate}
            handleClose={this.handleClose}
          />
        </Modal>
        <Modal show={this.state.showUpdate} onHide={this.handleClose}>
          {/* Actualizar Usuario */}
          <UpdateProjectFormik
            handleCloseUpdate={this.handleCloseUpdate}
            handleClose={this.handleClose}
            email={this.state.emailToEdit}
            usersInfo={this.state.usersInfo}
            projectInfo={this.state.projectInfo}
          />
        </Modal>
        <div className='container-alert time'>
          <Alert
            variant='success'
            show={this.state.showMessage}
            onClose={this.handleDismiss}
            dismissible>
            <p className='mb-0'>{this.state.message}</p>
          </Alert>
        </div>
      </>
    );
  }
}

export default ListProjects;
