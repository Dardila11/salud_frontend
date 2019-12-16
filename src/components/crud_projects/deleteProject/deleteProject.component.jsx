import React, { Component } from 'react';
import axios from 'axios';

import { Button, Modal, ProgressBar } from 'react-bootstrap';

import { getHeader } from '../../utils/utils';
import { URL } from '../../utils/URLSever';
import AlertComponent from '../../layout/alert/alert.component';

/**
 * @author Dardila
 * @description Este componente se encarga de activar o desactivar un proyecto.
 */
class DeleteProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: false,
      idToDelete: props.projectId,
      is_active: props.is_active,
      alertId: 'alert-delete-project',
      alertMessage: '',
      alertVariant: ''
    };
  }
  handleClose = () => {
    this.props.handleClose();
  };

  handleDelete = () => {
    const headers = getHeader();
    const { idToDelete } = this.state;

    /**
     * TODO: Falta realizar la llamada del API
     */
    this.setState({ progress: true }, () => {
      axios
        .delete(URL + '/studies/' + idToDelete + '/', {
          headers: headers
        })
        .then(() => {
          this.setState({ progress: false });
          this.handleCloseDelete();
        });
    });
  };

  handleCloseDelete = () => {
    this.props.handleCloseDelete();
  };

  componentDidMount() {
    console.log(this.props.is_active);
  }

  render() {
    return (
      <>
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
            {this.state.is_active ? 'Desactivar' : 'Activar'} proyecto
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Esta seguro que desea{' '}
            {this.state.is_active ? 'desactivar' : 'activar'} el proyecto?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleClose} variant='secondary'>
            Cancelar
          </Button>
          <Button
            onClick={this.handleDelete}
            variant={this.state.is_active ? 'danger' : 'primary'}>
            {this.state.is_active ? 'Desactivar' : 'Activar'} proyecto
          </Button>
        </Modal.Footer>
        <AlertComponent
          alertId={this.state.alertId}
          alertVariant={this.state.alertVariant}
          alertMessage={this.state.alertMessage}
        />
      </>
    );
  }
}

export default DeleteProject;
