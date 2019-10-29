import React, { Component } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import "./signIn.styles.css";
import { URL } from "../../utils/URLSever";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoggedIn: false,
      isVisible: false,
      adminDashboard: false,
      userDashboard: false
    };
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onLogin = event => {
    event.preventDefault();
    const { email, password } = this.state;
    axios.post(URL + "/users/login/", { email, password }).then(response => {
      //console.table(response.data);
      this.setState({ isLoggedIn: true });
      this.saveUserInfo(response.data);
    });
  };

  saveUserInfo = data => {
    localStorage.setItem("email", JSON.stringify(data.user.email));
    localStorage.setItem("token", JSON.stringify(data.token));
    let role;
    role =
      data.user.is_staff === true ? (role = "is_staff") : (role = "is_simple");
    localStorage.setItem("role", JSON.stringify(role));
    if (role === "is_staff") {
      this.setState({ adminDashboard: true });
    } else {
      this.setState({ userDashboard: true });
    }
  };

  componentDidMount() {
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
  }

  componentWillUnmount() {
    this.source.cancel("cancel request");
  }

  render() {
    if (this.state.adminDashboard) {
      return <Redirect to='/admin' />;
    } else if (this.state.userDashboard) {
      return <Redirect to='/user' />;
    }
    return (
      <Form onSubmit={this.onLogin}>
        <Form.Group controlId='formBasicEmail'>
          <Form.Label>Usuario</Form.Label>
          <Form.Control
            name='email'
            type='email'
            placeholder='Ingrese su usuario ó email'
            value={this.state.email}
            onChange={this.handleChange}
          />
        </Form.Group>

        <Form.Group controlId='formBasicPassword'>
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            name='password'
            type='password'
            placeholder='Contraseña'
            value={this.state.password}
            onChange={this.handleChange}
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
