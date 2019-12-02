import React, { Component } from 'react';
import axios from 'axios';
import { Modal, Alert } from 'react-bootstrap';
//import ReactTable from 'react-table';
import { URL } from '../../utils/URLSever';
import CreateProjectFormik from '../createProject/createProject.component';

import 'react-table/react-table.css';
import './listProjects.styles.css';

var modalUpdate = false;
class ListProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: [],
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
  }

  /**
   * todos los handleShow, create, update, view, delete
   * se encargan de cambiar el estado del correspondiente variable
   */
  handleCreate = () => {
    this.setState({ showCreate: true });
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
        //this.getProjects();
      }
    );
  };
  /**
   * @function handleCloseCreate function enviada como prop de un componente.
   * es llamada cuando un usuario es creado satisfactoriamente
   */
  handleCloseCreate = () => {
    this.setState({ showMessage: true, message: 'Usuario Creado' });
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
      });
  };

  getUsersInfo = () => {
    var usersInfoArray = [];
    for (let i = 0; i < this.state.info.length; i++) {
      var email = this.state.info[i].email;
      var firstName = this.state.info[i].first_name;
      var lastName = this.state.info[i].last_name;
      /*usersInfoArray.push({
        userEmail: email,
        userName: [{ name: firstName + ' ' + lastName }]
      });*/
      usersInfoArray.push({
        userEmail: email,
        userName: firstName + ' ' + lastName
      });
    }
    usersInfoArray.map(user => {
      console.log(user.userEmail + ' ' + user.userName);
    });
    this.setState({ usersInfo: usersInfoArray });
  };

  render() {
    return (
      <>
        <h1 className='h3 mb-2 text-gray-800'>Lista de estudios</h1>
        <button
          className='btn btn-primary btn-icon-split p-0 mb-2'
          onClick={this.handleCreate}>
          <span className='icon text-white-50'>
            <i className='fas fa-plus-square'></i>
          </span>
          <span className='text text-white'>Crear estudio</span>
        </button>

        <Modal size='lg' show={this.state.showCreate} onHide={this.handleClose}>
          {/* Crear Estudio */}
          <CreateProjectFormik
            usersInfo={this.state.usersInfo}
            handleCloseCreate={this.handleCloseCreate}
            handleClose={this.handleClose}
          />
        </Modal>
        <div className='no-login time'>
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
