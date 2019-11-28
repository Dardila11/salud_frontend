import React, { Component } from 'react';
import axios from 'axios';
import { Modal, Button, Alert } from 'react-bootstrap';
import ReactTable from 'react-table';
import { URL } from '../../utils/URLSever';
import CreateProjectFormik from '../createProject/createProject.component';

import 'react-table/react-table.css';
import './listProjects.styles.css';

class ListProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreate: false,
      showUpdate: false,
      showDelete: false,
      showView: false,
      showMessage: false,
      message: false
    };
  }

  handleCreate = () => {
    this.setState({ showCreate: true });
  };

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

  handleCloseCreate = () => {
    this.setState({ showMessage: true, message: 'Usuario Creado' });
    this.handleClose();
  };

  handleDismiss = () => {
    this.setState({ showMessage: false });
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
