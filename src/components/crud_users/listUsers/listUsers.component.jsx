import React, { Component } from 'react';
import axios from 'axios';

import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Capitalize from 'react-capitalize';
import ReactTable from 'react-table';

import { getHeader, showAlert } from '../../utils/utils';
import { URL } from '../../utils/URLSever';
import AlertComponent from '../../layout/alert/alert.component';
import CreateUserFormik from '../createUser/createUser.component';
import DeleteUser from '../deleteUser/deleteUser.component';
import UpdateUserFormik from '../updateUser/updateUser.component';
import ViewUserFormik from '../viewUser/viewUser.component';

import 'react-table/react-table.css';
import './listUsers.styles.css';

/**
 * @author Dardila
 * @description Este componente se encarga de listar la informacion de todos los usuarios en una tabla
 * y de permitir su correspondiente CRUD
 */
class ListUsers extends Component {
  typeModal = 0;

  constructor(props) {
    super(props);
    this.state = {
      emailToRead: '',
      info: [],
      infoCenters: [],
      infoDepartaments: [],
      userInfo: [1],
      userPermissions: [1],
      isVisibleCreate: false,
      isVisibleUpdate: false,
      isVisibleView: false,
      isVisibleDelete: false,
      alertVariant: '',
      alertMessage: '',
      alertId: 'alert-listUsers',
      columns: [
        {
          Header: 'Nombres',
          accessor: 'first_name',
          width: 150,
          maxWidth: 200,
          minWidth: 100,
          Cell: props => <Capitalize lowerRest>{props.value}</Capitalize>
        },
        {
          Header: 'Apellidos',
          accessor: 'last_name',
          width: 150,
          maxWidth: 200,
          minWidth: 100,
          Cell: props => <Capitalize lowerRest>{props.value}</Capitalize>
        },
        {
          Header: 'Correo',
          accessor: 'email',
          width: 200,
          maxWidth: 200,
          minWidth: 100
        },
        {
          id: 'is_simple',
          Header: 'Rol',
          accessor: d => {
            return d.is_simple ? 'Usuario' : 'Administrador';
          },
          sortable: false,
          filterable: false,
          width: 150,
          maxWidth: 150,
          minWidth: 100
        },
        {
          Header: 'Activo',
          accessor: 'is_active',
          sortable: true,
          filterable: false,
          width: 50,
          maxWidth: 50,
          minWidth: 50,
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
          width: 150,
          maxWidth: 150,
          minWidth: 150,
          Cell: props => {
            return (
              <div>
                <OverlayTrigger
                  placement='right'
                  delay={{ show: 250, hide: 100 }}
                  overlay={<Tooltip>Actualizar</Tooltip>}
                >
                  <Button
                    className='update'
                    variant='outline-primary'
                    onClick={() => {
                      this.updateRow(props.original.email);
                    }}
                  ></Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement='right'
                  delay={{ show: 250, hide: 100 }}
                  overlay={<Tooltip>Detalles</Tooltip>}
                >
                  <Button
                    className='ml-1 view'
                    variant='outline-primary'
                    onClick={() => {
                      this.viewRow(props.original.email);
                    }}
                  ></Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement='left'
                  delay={{ show: 250, hide: 100 }}
                  overlay={<Tooltip>Estado</Tooltip>}
                >
                  <Button
                    className='ml-1 change'
                    variant='outline-danger'
                    onClick={() => {
                      this.deleteRow(props.original.email);
                    }}
                  ></Button>
                </OverlayTrigger>
              </div>
            );
          }
        }
      ]
    };
  }

  handleCloseCreate = () => {
    this.setState({ alertVariant: 'success', alertMessage: 'Usuario creado.' });
    this.handleClose();
    showAlert(this.state.alertId);
  };

  handleCloseDelete = () => {
    this.setState({
      alertVariant: 'success',
      alertMessage: 'Estado del usuario modificado.'
    });
    this.handleClose();
    showAlert(this.state.alertId);
  };

  handleCloseUpdate = () => {
    this.setState({
      alertVariant: 'success',
      alertMessage: 'Usuario actualizado.'
    });
    this.handleClose();
    showAlert(this.state.alertId);
  };

  /**
   * @function handleClose se encarga de cerrar todas los modales
   */
  handleClose = () => {
    const { isVisibleCreate, isVisibleDelete, isVisibleUpdate } = this.state;
    if (
      isVisibleCreate === true ||
      isVisibleDelete === true ||
      isVisibleUpdate === true
    ) {
      this.getUsers();
    }
    this.setState({
      isVisibleCreate: false,
      isVisibleUpdate: false,
      isVisibleDelete: false,
      isVisibleView: false
    });
  };

  handleOpenCreate = () => {
    this.setState({ isVisibleCreate: true });
  };

  handleOpenDelete = () => {
    this.setState({ isVisibleDelete: true });
  };

  handleOpenUpdate = () => {
    this.setState({ isVisibleUpdate: true });
  };

  handleOpenView = () => {
    this.setState({ isVisibleView: true });
  };

  /**
   * @function getUserByEmail
   * @description obtiene la informacion del usuario por medio de su email.
   */
  getUserByEmail = async email => {
    const headers = getHeader();
    axios.get(URL + '/users/' + email, { headers: headers }).then(response => {
      this.setState({ userInfo: response.data }, () => {
        if (this.typeModal === 0) {
          this.handleOpenUpdate();
        } else if (this.typeModal === 1) {
          this.handleOpenView();
        } else if (this.typeModal === 2) {
          this.handleOpenDelete();
        }
        this.typeModal = 0;
      });
    });
  };

  /**
   * @function getUserPermissions
   * @description Obtiene todos los permisos de un usuario por su email
   * @param email
   */
  getUserPermissions = async email => {
    const headers = getHeader();
    axios
      .get(URL + '/users/permissions/all/' + email, { headers: headers })
      .then(response => {
        this.setState({ userPermissions: response.data }, () => {
          this.getUserByEmail(email);
        });
      });
  };

  /**
   * @function loadDepartaments
   * @description Obtiene todos los `Departement`
   */
  loadDepartaments = async () => {
    const headers = getHeader();
    axios
      .get(URL + '/places/department/all/', { headers: headers })
      .then(response => {
        this.setState({ infoDepartaments: response.data }, () => {
          this.viewDepartmentsInfo();
        });
      });
  };

  /**
   * @function viewDepartmentsInfo
   * @description Formatea los `Department` en una lista
   */
  viewDepartmentsInfo = () => {
    var optionsDepArray = [];
    for (let index = 0; index < this.state.infoDepartaments.length; index++) {
      var name = this.state.infoDepartaments[index].fields.name;
      var pk = this.state.infoDepartaments[index].pk;
      optionsDepArray.push({ myPk: pk, myName: name });
    }
    this.setState({ infoDepartaments: optionsDepArray });
  };

  /**
   * @function loadCenters
   * @description Obtiene todos los `Center`
   */
  loadCenters = async () => {
    const headers = getHeader();
    axios
      .get(URL + '/places/center/all/', { headers: headers })
      .then(response => {
        this.setState({ infoCenters: response.data }, () => {
          this.viewCentersInfo();
        });
      });
  };

  /**
   * @function viewCentersInfo
   * @description Formatea los `Center` en una lista
   */
  viewCentersInfo = () => {
    var optionsCentersArray = [];
    for (let index = 0; index < this.state.infoCenters.length; index++) {
      var name = this.state.infoCenters[index].fields.name;
      var pk = this.state.infoCenters[index].pk;
      optionsCentersArray.push({ myPk: pk, myName: name });
    }
    this.setState({ infoCenters: optionsCentersArray });
  };

  /**
   * @function getUsers
   * @description Obtiene todos los `User`
   */
  getUsers = async () => {
    const headers = getHeader();
    axios.get(URL + '/users/all/', { headers: headers }).then(response => {
      this.setState({ info: response.data });
    });
  };

  /**
   * @function updateRow
   * @description Carga el modal de actualizar un usuario
   */
  updateRow = email => {
    this.typeModal = 0;
    this.setState({ emailToRead: email }, () => {
      this.getUserPermissions(this.state.emailToRead);
    });
  };

  /**
   * @function viewRow
   * @description Carga el modal de ver la información del usuario
   */
  viewRow = email => {
    this.typeModal = 1;
    this.setState({ emailToRead: email }, () => {
      this.getUserPermissions(this.state.emailToRead);
    });
  };

  /**
   * @function deleteRow
   * @description Carga el modal de cambiar el estado del usuario
   */
  deleteRow = email => {
    this.typeModal = 2;
    this.setState({ emailToRead: email }, () => {
      this.getUserByEmail(this.state.emailToRead);
    });
  };

  /**
   * @function componentDidMount
   * @description Carga los datos después que el componente carga
   */
  componentDidMount() {
    this.getUsers();
    this.loadCenters();
    this.loadDepartaments();
  }

  render() {
    return (
      <section>
        <h1 className='h3 mb-2 text-gray-800'>Lista de usuarios</h1>
        <button
          className='btn btn-primary btn-icon-split p-0 mb-2'
          onClick={this.handleOpenCreate}
        >
          <span className='icon text-white-50'>
            <i className='fas fa-plus-square'></i>
          </span>
          <span className='text text-white'>Crear usuario</span>
        </button>
        <ReactTable
          columns={this.state.columns}
          data={this.state.info}
          defaultPageSize={6}
          noDataText={'No existen usuarios'}
          filterable
        ></ReactTable>
        <Modal show={this.state.isVisibleCreate} onHide={this.handleClose}>
          {/* Crear Usuario */}
          <CreateUserFormik
            infoDepartaments={this.state.infoDepartaments}
            infoCenters={this.state.infoCenters}
            handleCloseCreate={this.handleCloseCreate}
            handleClose={this.handleClose}
          />
        </Modal>
        <Modal show={this.state.isVisibleDelete} onHide={this.handleClose}>
          {/* Eliminar Usuario */}
          <DeleteUser
            handleCloseDelete={this.handleCloseDelete}
            handleClose={this.handleClose}
            email={this.state.emailToRead}
            is_active={this.state.userInfo[0].is_active}
          />
        </Modal>
        <Modal show={this.state.isVisibleUpdate} onHide={this.handleClose}>
          {/* Actualizar Usuario */}
          <UpdateUserFormik
            infoDepartaments={this.state.infoDepartaments}
            infoCenters={this.state.infoCenters}
            handleCloseUpdate={this.handleCloseUpdate}
            handleClose={this.handleClose}
            email={this.state.emailToRead}
            userInfo={this.state.userInfo}
            userPermissions={this.state.userPermissions}
          />
        </Modal>
        <Modal show={this.state.isVisibleView} onHide={this.handleClose}>
          {/* Ver Usuario */}
          <ViewUserFormik
            infoDepartaments={this.state.infoDepartaments}
            infoCenters={this.state.infoCenters}
            handleClose={this.handleClose}
            email={this.state.emailToRead}
            userInfo={this.state.userInfo}
            userPermissions={this.state.userPermissions}
          />
        </Modal>
        <AlertComponent
          alertId={this.state.alertId}
          alertVariant={this.state.alertVariant}
          alertMessage={this.state.alertMessage}
        ></AlertComponent>
      </section>
    );
  }
}

export default ListUsers;
