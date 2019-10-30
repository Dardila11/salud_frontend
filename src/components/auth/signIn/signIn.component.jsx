import React, { Component } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import "./signIn.styles.css";
import { URL } from "../../utils/URLSever";
import logo from "../../../img/logo.png";

// TODO
// - Diseñar el login correctamente
// - Completar los mensajes de error (de acuerdo a la respuesta del servidor)
// - Terminar todas las funcionalidades del login: recordar contraseña, olvidé constraseña

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoggedIn: false,
      isVisible: false,
      adminDashboard: false,
      userDashboard: false,
      alertVariant: "",
      message: "",
      show: false
    };
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleDismiss = () => this.setState({ isVisible: false });

  onLogin = event => {
    event.preventDefault();
    if (this.validateForm()) {
      const { email, password } = this.state;
      axios
        .post(URL + "/users/login/", { email, password })
        .then(response => {
          //console.table(response.data);
          this.setState({ isLoggedIn: true });
          this.saveUserInfo(response.data);
        })
        .catch(error => {
          console.warn(error.response.data.error);
          this.setState({
            isVisible: true,
            alertVariant: "danger",
            message: "Usuario o Clave incorrectos."
          });
        });
    } else {
      this.setState({
        isVisible: true,
        alertVariant: "warning",
        message: "Ingrese todos los datos."
      });
    }
  };

  saveUserInfo = data => {
    localStorage.setItem("email", JSON.stringify(data.user.email));
    localStorage.setItem("token", JSON.stringify(data.token));
    localStorage.setItem("user", JSON.stringify(data.user.username));
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

  validateForm = () => {
    return this.state.email.length > 0 && this.state.password.length > 0;
  };

  render() {
    if (this.state.adminDashboard) {
      return <Redirect to='/admin' />;
    } else if (this.state.userDashboard) {
      return <Redirect to='/user' />;
    }

    return (
      <>
        <div className='vertically'>
          <img className='logo' src={logo} alt='logo' />
          <div className='box Login'>
            <Form onSubmit={this.onLogin} className='form'>
              <Form.Group controlId='formBasicEmail'>
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  name='email'
                  type='email'
                  placeholder='Ingrese su email'
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
          </div>
          <div>
            <Alert
              className='alert'
              variant={this.state.alertVariant}
              show={this.state.isVisible}
              onClose={this.handleDismiss}
              dismissible>
              <span>{this.state.message}</span>
            </Alert>
          </div>
        </div>
      </>
    );
  }
}

export default SignIn;
