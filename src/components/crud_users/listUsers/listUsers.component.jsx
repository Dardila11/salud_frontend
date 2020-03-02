import React, { Component } from 'react';
import axios from 'axios';

import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import ReactTable from 'react-table';
import matchSorter from 'match-sorter';

import { getHeader, showAlert } from '../../utils/utils';
import { URL } from '../../utils/URLSever';
import AlertComponent from '../../layout/alert/alert.component';
import CreateUserFormik from '../createUser/createUser.component';
import DeleteUser from '../deleteUser/deleteUser.component';
import UpdateUserFormik from '../updateUser/updateUser.component';

import 'react-table/react-table.css';
import './listUsers.styles.css';

const NoDataConst = () => (
  <Loader
    type='ThreeDots'
    color='#00BFFF'
    height={100}
    width={100}
    className='mh -loading -active'
  />
);

/**
 * @author Dardila
 * @description Este componente se encarga de listar la informacion de todos los usuarios en una tabla
 * y de permitir su correspondiente CRUD
 */
class ListUsers extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();
  isUpdate = true;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      emailToRead: '',
      info: [],
      infoCenters: [],
      infoDepartaments: [],
      userInfo: [1],
      userPermissions: [],
      isVisibleCreate: false,
      isVisibleUpdate: false,
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
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ['first_name'] }),
          filterAll: true,
          Cell: props => <span className='cap'>{props.value}</span>
        },
        {
          Header: 'Apellidos',
          accessor: 'last_name',
          width: 150,
          maxWidth: 200,
          minWidth: 100,
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ['last_name'] }),
          filterAll: true,
          Cell: props => <span className='cap'>{props.value}</span>
        },
        {
          Header: 'Correo',
          accessor: 'email',
          width: 200,
          maxWidth: 200,
          minWidth: 100,
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ['email'] }),
          filterAll: true,
          Cell: props => (
            <Link to={'/admin/users/' + props.value}>{props.value}</Link>
          )
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
          width: 250,
          maxWidth: 250,
          minWidth: 200,
          Cell: props => {
            return (
              <div>
                <OverlayTrigger
                  placement='right'
                  delay={{ show: 250, hide: 100 }}
                  overlay={<Tooltip>Actualizar</Tooltip>}>
                  <Button
                    className='update'
                    variant='outline-primary'
                    onClick={() => {
                      this.updateRow(props.original.email);
                    }}></Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement='right'
                  delay={{ show: 250, hide: 100 }}
                  overlay={<Tooltip>Detalles</Tooltip>}>
                  <Link
                    className='ml-1 view btn btn-outline-primary'
                    variant='outline-primary'
                    role='button'
                    to={'/admin/users/' + props.original.email}
                  />
                </OverlayTrigger>
                <OverlayTrigger
                  placement='right'
                  delay={{ show: 250, hide: 100 }}
                  overlay={<Tooltip>Estado</Tooltip>}>
                  <Button
                    className='ml-1 change'
                    variant='outline-danger'
                    onClick={() => {
                      this.deleteRow(props.original.email);
                    }}></Button>
                </OverlayTrigger>
              </div>
            );
          }
        }
      ]
    };
  }

  handleCloseCreate = () => {
    this.getUsers();
    this.setState({ alertVariant: 'success', alertMessage: 'Usuario creado.' });
    this.handleClose();
    showAlert(this.state.alertId);
  };

  handleCloseDelete = () => {
    this.getUsers();
    this.setState({
      alertVariant: 'success',
      alertMessage: 'Estado del usuario modificado.'
    });
    this.handleClose();
    showAlert(this.state.alertId);
  };

  handleCloseUpdate = () => {
    this.getUsers();
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

  /**
   * @function getUserByEmail
   * @description obtiene la informacion del usuario por medio de su email.
   */
  getUserByEmail = async email => {
    const headers = getHeader();
    await axios
      .get(
        URL + '/users/' + email,
        { headers: headers },
        { cancelToken: this.source.token }
      )
      .then(response => {
        this.setState({ userInfo: response.data }, () => {
          if (this.isUpdate) {
            this.handleOpenUpdate();
          } else {
            this.handleOpenDelete();
          }
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
    await axios
      .get(
        URL + '/users/permissions/all/' + email,
        { headers: headers },
        { cancelToken: this.source.token }
      )
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
    await axios
      .get(
        URL + '/places/department/all/',
        { headers: headers },
        { cancelToken: this.source.token }
      )
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
    await axios
      .get(
        URL + '/places/center/all/',
        { headers: headers },
        { cancelToken: this.source.token }
      )
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
      var name = this.state.infoCenters[index].name;
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
    this.setState({ loading: true }, () =>
      axios
        .get(
          URL + '/users/all/',
          { headers: headers },
          { cancelToken: this.source.token }
        )
        .then(response => {
          this.setState({ info: response.data, loading: false });
        })
    );
  };

  /**
   * @function updateRow
   * @description Carga el modal de actualizar un usuario
   */
  updateRow = email => {
    this.isUpdate = true;
    this.setState({ emailToRead: email }, () => {
      this.getUserPermissions(this.state.emailToRead);
    });
  };

  /**
   * @function deleteRow
   * @description Carga el modal de cambiar el estado del usuario
   */
  deleteRow = email => {
    this.isUpdate = false;
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

  componentWillUnmount() {
    this.source.cancel('cancel request');
  }

  render() {
    return (
      <section>
        <h1 className='h3 mb-2 text-gray-800'>Lista de usuarios</h1>
        <button
          className='btn btn-primary btn-icon-split p-0 mb-2'
          onClick={this.handleOpenCreate}>
          <span className='icon text-white-50'>
            <i className='fas fa-plus-square'></i>
          </span>
          <span className='text text-white'>Crear usuario</span>
        </button>
        {this.state.loading ? (
          <ReactTable
            columns={this.state.columns}
            defaultPageSize={5}
            NoDataComponent={NoDataConst}></ReactTable>
        ) : (
          <ReactTable
            columns={this.state.columns}
            data={this.state.info}
            defaultPageSize={5}
            noDataText={'No existen usuarios'}
            filterable></ReactTable>
        )}
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
        <AlertComponent
          alertId={this.state.alertId}
          alertVariant={this.state.alertVariant}
          alertMessage={this.state.alertMessage}
        />
      </section>
    );
  }
}

export default ListUsers;
