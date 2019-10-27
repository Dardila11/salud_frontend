import React, { Component } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import "./signIn.styles.css";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isLoggedIn: false,
      isVisible: false
    };
  }

  render() {
    return (
      <Form>
        <Form.Group controlId='formBasicEmail'>
          <Form.Label>Usuario</Form.Label>
          <Form.Control
            type='email'
            placeholder='Ingrese su usuario ó email'
            value={this.state.username}
          />
        </Form.Group>

        <Form.Group controlId='formBasicPassword'>
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type='password'
            placeholder='Contraseña'
            value={this.state.password}
          />
        </Form.Group>
        <Form.Group controlId='formBasicCheckbox'>
          <Form.Check type='checkbox' label='Recordar Contraseña' />
        </Form.Group>
        <Button variant='primary' type='submit'>
          Ingresar
        </Button>
      </Form>
    );
  }
}

export default SignIn;
