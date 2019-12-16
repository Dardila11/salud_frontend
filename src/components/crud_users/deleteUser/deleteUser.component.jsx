import React, { Component } from 'react';
import axios from 'axios';

import { Button, Modal, ProgressBar } from 'react-bootstrap';

import { getHeader } from '../../utils/utils';
import { URL } from '../../utils/URLSever';
import AlertComponent from '../../layout/alert/alert.component';

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
      progress: false,
      emailToDelete: props.email,
      is_active: props.is_active
    };
  }
  
  handleClose = () => {
    this.props.handleClose();
  };

  handleDelete = () => {
    const headers = getHeader();
    const data = {
      email_instance: this.state.emailToDelete
    };
    this.setState({ progress: true }, () =>
      axios
        .delete(URL + '/users/', { headers: headers, data: data })
        .then(() => {
          this.setState({ progress: false });
          this.handleCloseDelete();
        })
        .catch(error => {
          console.log(error.response);
        })
    );
  };

  handleCloseDelete = () => {
    this.props.handleCloseDelete();
  };

  render() {
    return (
      <section>
        {this.state.progress ? (
          <ProgressBar
            className='progress'
            animated
            now={100}
            id='progress-admin'
          />
        ) : (
          <></>
        )}
        <Modal.Header closeButton>
          <Modal.Title className='h3 text-gray-800 mb-0'>
            {this.state.is_active ? 'Desactivar' : 'Activar'} usuario
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            ¿Esta seguro que desea{' '}
            {this.state.is_active ? 'desactivar' : 'activar'} el usuario?
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.handleClose} variant='secondary'>
            Cancelar
          </Button>
          <Button
            onClick={this.handleDelete}
            variant={this.state.is_active ? 'danger' : 'primary'}>
            {this.state.is_active ? 'Desactivar' : 'Activar'} usuario
          </Button>
        </Modal.Footer>
        <AlertComponent
          alertId={this.state.alertId}
          alertVariant={this.state.alertVariant}
          alertMessage={this.state.alertMessage}
        />
      </section>
    );
  }
}

export default DeleteUser;
