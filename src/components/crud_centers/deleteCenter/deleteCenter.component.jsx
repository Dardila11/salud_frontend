import React, { Component } from 'react';
import axios from 'axios';

import { Button, Modal, ProgressBar } from 'react-bootstrap';

import { getHeader } from '../../utils/utils';
import { URL } from '../../utils/URLSever';
import AlertComponent from '../../layout/alert/alert.component';

class DeleteCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: false,
      alertMessage: '',
      alertVariant: '',
      alertId: 'alert-delete-questionary'
    };
  }

  handleClose = () => {
    this.props.handleClose();
  };

  handleDelete = () => {
    const headers = getHeader();
    console.log(this.props.center)
    const data = {
      center_id: this.props.center
    };
    this.setState({ progress: true }, () =>
      axios
        .delete(URL + '/studies/center/', { headers: headers, data: data })
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
            {this.props.is_active ? 'Desactivar' : 'Activar'} centro
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            ¿Esta seguro que desea{' '}
            {this.props.is_active ? 'desactivar' : 'activar'} el centro?
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.handleClose} variant='secondary'>
            Cancelar
          </Button>
          <Button
            onClick={this.handleDelete}
            variant={this.props.is_active ? 'danger' : 'primary'}>
            {this.props.is_active ? 'Desactivar' : 'Activar'} centro
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

export default DeleteCenter;
