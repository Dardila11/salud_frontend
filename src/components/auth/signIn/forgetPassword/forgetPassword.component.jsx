import React, { Component } from 'react';
import axios from 'axios';

import { Button, Form, Modal } from 'react-bootstrap';
import { URL } from '../../../utils/URLSever';

export default class ForgetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validated: false,
      email: ''
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
    const { email } = this.state;
    axios
      .put(URL + '/users/password/recovery/', { email })
      .then(() => {})
      .catch(error => {
        this.setState({
          message: JSON.parse(error.request.response).detail
        });
      });
  };

  render() {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title class='h3 text-gray-800 mb-0'>
            Recuperar Contraseña
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            id='formForgetPassword'
            noValidate
            validated={this.state.validated}
            onSubmit={this.handleSubmit}
          >
            <Form.Row>
              <Form.Label>Email de inscripción</Form.Label>
              <Form.Control
                required
                type='email'
                name='email'
                placeholder='Email'
                defaultValue={this.state.email}
                onChange={this.handleChange}
              />
            </Form.Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={this.handleClose}>
            Cancelar
          </Button>
          <Button
            form='formForgetPassword'
            onClick={this.handleCloseForgetPassword}
            type='submit'
          >
            Enviar Email
          </Button>
        </Modal.Footer>
      </>
    );
  }
}
