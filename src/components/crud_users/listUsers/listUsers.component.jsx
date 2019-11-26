import React, { Component } from 'react';
import axios from 'axios';
import { Modal, Button, Alert } from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { URL } from '../../utils/URLSever';
//import CreateUser from '../createUser/createUser';
import CreateUserFormik from '../createUser/createUser.component';
import UpdateUser from '../updateUser/updateUser';
import ViewUser from '../viewUser/viewUser';
import DeleteUser from '../deleteUser/deleteUser';
import './listUsers.styles.css';

/**
 * @todo - eliminar la columna centro y departamento
 * - cambiar la columna Rol por 'Administrador' mostrar un check si lo es o no.
 * - cambiar los botones de las acciones por los iconos
 */
/**
 * @author Dardila
 * @description Este componente se encarga de listar la informacion de todos los usuarios en una tabla
 * y de permitir su correspondiente CRUD
 */
class ListUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailToEdit: '',
      allInfo: [],
      info: [],
      infoUsers: [],
      infoCenters: [],
      infoDepartaments: [],
      show: false,
      showCreate: false,
      showUpdate: false,
      showView: false,
      showDelete: false,
      showAlert: false,
      showMessage: false,
      message: false
    };
  }

  /**
   * @function handleCloseCreate function enviada como prop de un componente.
   * es llamada cuando un usuario es creado satisfactoriamente
   */
  handleCloseCreate = () => {
    // mostrar mensaje usuario creado
    this.setState({ showMessage: true, message: 'Usuario Creado' });
    this.handleClose();
  };

  /**
   * @function handleCloseView function enviada como prop de un componente.
   * es llamada se cierra el modal de ViewUser
   */
  handleCloseView = () => {
    // mostrar mensaje usuario creado
    this.handleClose();
  };
  /**
   * @function handleCloseUpdate function enviada como prop de un componente.
   * es llamada cuando un usuario es actualizado satisfactoriamente
   */
  handleCloseUpdate = () => {
    this.setState({ showMessage: true, message: 'Usuario Actualizado' });
    this.handleClose();
  };
  /**
   * @function handleCloseDelete function enviada como prop de un componente.
   * es llamada se elimina un usuario.
   */
  handleCloseDelete = () => {
    /**
     * @todo mostrar mensaje de usuario eliminado
     */
    this.handleClose();
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
        this.getUsers();
      }
    );
  };

  /**
   * todos los handleShow, create, update, view, delete
   * se encargan de cambiar el estado del correspondiente variable
   */

  handleShow = () => {
    this.setState({ show: true });
  };

  handleCreate = () => {
    this.setState({ showCreate: true });
  };

  handleUpdate = email => {
    this.setState({ showUpdate: true });
  };

  handleView = email => {
    this.setState({ showView: true });
  };

  handleDelete = event => {
    this.setState({ showDelete: true });
  };

  /**
   * @function loadDepartaments
   * @description Realiza una peticion al servidor el cual obtiene todos los
   * departamentos que existen. Si la peticion es aceptada, finaliza llamando
   * la @function viewDepartmentsInfo
   *
   * @todo agregar el evento de error
   */
  loadDepartaments = async () => {
    var token = JSON.parse(localStorage.getItem('token'));
    axios
      .get(URL + '/places/department/all/', {
        headers: {
          Authorization: 'JWT ' + token
        }
      })
      .then(response => {
        this.setState({ infoDepartaments: response.data }, () => {
          this.viewDepartmentsInfo();
        });
      });
  };

  /**
   * @function viewDepartmentsInfo
   * @description Se encarga de extraer solo la informacion que se necesita.
   * el name y pk del departamento
   */
  viewDepartmentsInfo = () => {
    console.log(this.state.infoDepartaments);
    var optionsDepArray = [];
    // recorremos todo los centros y sacamos el nombre y el id
    for (let index = 0; index < this.state.infoDepartaments.length; index++) {
      var name = this.state.infoDepartaments[index].fields.name;
      var pk = this.state.infoDepartaments[index].pk;
      optionsDepArray.push({ myPk: pk, myName: name });
    }
    this.setState({ infoDepartaments: optionsDepArray });
  };

  /**
   * @function loadCenters
   * @description Realiza una peticion al servidor el cual obtiene todos los
   * centros que existen. Si la peticion es aceptada, finaliza llamando
   * la @function viewCentersInfo
   *
   * @todo agregar el evento de error
   */
  loadCenters = async () => {
    console.log('se ejecuta loadCenters');
    const token = JSON.parse(localStorage.getItem('token'));
    axios
      .get(URL + '/places/center/all/', {
        headers: {
          Authorization: 'JWT ' + token
        }
      })
      .then(response => {
        this.setState({ infoCenters: response.data }, () => {
          this.viewCentersInfo();
        });
      });
  };

  /**
   * @function viewCentersInfo
   * @description Se encarga de extraer solo la informacion que se necesita.
   * el name y pk del departamento
   */
  viewCentersInfo = () => {
    console.log(this.state.infoCenters);
    var optionsCentersArray = [];
    // recorremos todo los centros y sacamos el nombre y el id
    for (let index = 0; index < this.state.infoCenters.length; index++) {
      var name = this.state.infoCenters[index].fields.name;
      var pk = this.state.infoCenters[index].pk;
      console.log('Nombre del centro: ' + name + ' pk: ' + pk);
      optionsCentersArray.push({ myPk: pk, myName: name });
    }

    this.setState({ infoCenters: optionsCentersArray });
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
        //console.log(response.data["2"].fields.first_name);
        console.log(response.data);
        this.setState({ info: response.data }, () => {
          /*console.log('Todos los usuarios: ' + this.state.info['2'].is_simple);
          for (let index = 0; index < this.state.info.length; index++) {
            console.log(this.state.info[index]);
          }*/
        });
      });
  };

  /**
   * @function componentDidMount
   * @description despues de que se monta el componente
   * este llama las siguientes funciones
   */
  componentDidMount() {
    this.getUsers();
    this.loadCenters();
    this.loadDepartaments();
  }

  /**
   * @function updateRow
   * @description Se encarga de mostrar el modal de actualizacion de usuario y cargar la informacion
   * del usuario (su email)
   */
  updateRow = email => {
    this.setState({ emailToEdit: email });
    this.handleUpdate(email);
  };

  /**
   * @function viewRow
   * @description Se encarga de mostrar el modal de ver la informacion del usuario y cargar la informacion
   * del usuario (su email)
   */
  viewRow = email => {
    this.setState({ emailToEdit: email }, () => {
      console.log('viewRow: ' + this.state.emailToEdit);
      this.handleView(email);
    });
  };

  /**
   * @function deleteRow
   * @description Carga el modal de confirmacion de eliminacion del usuario
   */
  deleteRow = email => {
    this.setState({ emailToEdit: email });
    this.handleDelete(email);
  };

  render() {
    const handleDismiss = () => this.setState({ showMessage: false });
    /**
     * @var columns contiene la informacion de las columnas de la tabla donde se muestra
     * la informacion de los usuario.
     */
    const columns = [
      {
        Header: 'Nombres',
        accessor: 'first_name',
        width: 150,
        maxWidth: 200,
        minWidth: 100
      },
      {
        Header: 'Apellidos',
        accessor: 'last_name',
        width: 150,
        maxWidth: 200,
        minWidth: 100
      },
      {
        Header: 'Email',
        accessor: 'email',
        width: 200,
        maxWidth: 200,
        minWidth: 100
      },
      {
        Header: 'Centro',
        accessor: 'my_center__name',
        sortable: false,
        filterable: false,
        width: 100,
        maxWidth: 100,
        minWidth: 100
      },
      {
        Header: 'Departamentos',
        accessor: 'my_department__name',
        sortable: false,
        filterable: false,
        width: 150,
        maxWidth: 150,
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
                  this.updateRow(props.original.email);
                }}>
                Editar
              </Button>
              <Button
                className='ml-1'
                onClick={() => {
                  console.log(props.original.email);
                  this.viewRow(props.original.email);
                }}>
                Ver
              </Button>
              <Button
                className='ml-1'
                onClick={() => {
                  this.deleteRow(props.original.email);
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
        <h1 className='h3 mb-2 text-gray-800'>Lista de usuarios</h1>
        <button
          className='btn btn-primary btn-icon-split p-0 mb-2'
          onClick={this.handleCreate}>
          <span className='icon text-white-50'>
            <i className='fas fa-plus-square'></i>
          </span>
          <span className='text text-white'>Crear usuario</span>
        </button>
        <ReactTable
          columns={columns}
          data={this.state.info}
          defaultPageSize={6}
          noDataText={'No existen usuarios'}
          filterable></ReactTable>

        <Modal show={this.state.showCreate} onHide={this.handleClose}>
          {/* Crear Usuario */}
          <CreateUserFormik
            infoDepartaments={this.state.infoDepartaments}
            infoCenters={this.state.infoCenters}
            handleCloseCreate={this.handleCloseCreate}
            handleClose={this.handleClose}
          />
        </Modal>
        <Modal show={this.state.showUpdate} onHide={this.handleClose}>
          {/* Actualizar Usuario */}
          <UpdateUser
            handleCloseUpdate={this.handleCloseUpdate}
            handleClose={this.handleClose}
            email={this.state.emailToEdit}
          />
        </Modal>
        <Modal show={this.state.showView} onHide={this.handleClose}>
          {/* Ver Usuario */}
          <ViewUser
            handleCloseView={this.handleCloseView}
            handleClose={this.handleClose}
            email={this.state.emailToEdit}
          />
        </Modal>
        <Modal show={this.state.showDelete} onHide={this.handleClose}>
          {/* Eliminar Usuario */}
          <DeleteUser
            handleCloseDelete={this.handleCloseDelete}
            handleClose={this.handleClose}
            email={this.state.emailToEdit}
          />
        </Modal>
        <div className='no-login time'>
          <Alert
            variant='success'
            show={this.state.showMessage}
            onClose={handleDismiss}
            dismissible>
            <p className='mb-0'>{this.state.message}</p>
          </Alert>
        </div>
      </>
    );
  }
}

export default ListUsers;
