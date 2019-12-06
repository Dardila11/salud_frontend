import React, { Component } from "react";
import { Button, Modal, Form, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { URL } from "../../../utils/URLSever";
export default class ForgetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validated: false,
      email: ""
    };
  }

  handleCloseForget = () => {
    this.props.handleCloseForget();
  };
  handleClose = () => {
    this.props.handleClose();
  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
    const { email } = this.state;
    axios
      .put(URL + "/users/password/recovery/", { email })
      .then(response => {
        console.log(response.data);
      })
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
          <Modal.Title class="h3 text-gray-800 mb-0">
            Recuperar Contraseña
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            id="formForgetPassword"
            noValidate
            validated={this.state.validated}
            onSubmit={this.handleSubmit}
          >
            <Form.Row>
              <Form.Label>Email de inscripcion</Form.Label>
              <Form.Control
                required
                type="email"
                name="email"
                placeholder="Email"
                defaultValue={this.state.email}
                onChange={this.handleChange}
              />
            </Form.Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={this.handleClose}>
            Cancelar
          </Button>
          <Button
            form="formForgetPassword"
            onClick={this.handleCloseForget}
            type="submit"
          >
            Enviar Email
          </Button>
        </Modal.Footer>
      </>
    );
  }
}
