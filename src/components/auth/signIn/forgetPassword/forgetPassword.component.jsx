import React, { Component } from 'react';
import axios from 'axios';

import { Button, Form, Modal, ProgressBar } from 'react-bootstrap';
import { URL } from '../../../utils/URLSever';

export default class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      email: this.props.email,
      progress: false
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleClose = () => {
    this.props.handleClose();
  };

  handleCloseForgetPassword = () => {
    this.props.handleCloseForgetPassword();
  };

  handleSubmit = event => {
    event.preventDefault();
    const data = {
      email: this.state.email
    };
    this.setState({ progress: true }, () => {
      axios
        .put(URL + '/users/password/recovery/', data)
        .then(() => {
          this.handleCloseForgetPassword();
          this.setState({ progress: false });
        })
        .catch(() => {
          this.handleCloseForgetPassword();
          this.setState({ progress: false });
        });
    });
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
            Recuperar contraseña
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id='formForgetPassword' onSubmit={this.handleSubmit}>
            <Form.Label>Correo de registro</Form.Label>
            <Form.Control
              required
              type='email'
              name='email'
              defaultValue={this.state.email}
              onChange={this.handleChange}
              placeholder='Correo de registro'
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={this.handleClose}>
            Cancelar
          </Button>
          <Button form='formForgetPassword' type='submit'>
            Enviar correo
          </Button>
        </Modal.Footer>
      </section>
    );
  }
}
