import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { URL } from '../../utils/URLSever';
import axios from 'axios';

/**
 * @author Dardila
 * @description Este componente se encarga de activar o desactivar un usuario.
 * @todo se necesita que desde la api de getUserByEmail se obtenga el estado del usuario
 * para poder ademas de desactivarlo, activarlo cuando se requiera
 */
class DeleteUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailToDelete: props.email,
      is_active: -1
    };
  }
  handleClose = () => {
    this.props.handleClose();
  };

  handleDelete = () => {
    const token = JSON.parse(localStorage.getItem('token'));
    var json = {
      email_instance: this.state.emailToDelete,
      is_active: 0
    };
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + token
    };
    axios
      .put(URL + '/users/active/', json, {
        headers: headers
      })
      .then(response => {
        console.log(response.data);
        this.handleCloseDelete();
      })
      .catch(error => {
        console.log('hubo un error');
        console.log(error.status);
      });
  };

  handleCloseDelete = () => {
    this.props.handleCloseDelete();
  };
  render() {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Activar o Desactivar Usuario</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>¿Esta seguro que desea desactivar el usuario?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.handleClose} variant='secondary'>
            Cancelar
          </Button>
          <Button onClick={this.handleDelete} variant='danger'>
            Eliminar
          </Button>
        </Modal.Footer>
      </>
    );
  }
}

export default DeleteUser;
