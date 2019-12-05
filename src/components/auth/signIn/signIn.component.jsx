import React, { Component } from 'react';
import axios from 'axios';
import { Modal,Form, Button, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import './signIn.styles.css';
import { URL } from '../../utils/URLSever';
import ForgetPassword from "../signIn/forgetPassword/forgetPassword"

/**
 * @todo
 * - Terminar todas las funcionalidades del login:
 *   recordar contraseña, olvidé constraseña
 */

/**
 * @author Dardila
 * @description este componente se encarga del ingreso a la aplicacion
 * se le pide al usuario ingresar su 'email' y 'contraseña'. y si son correctas
 * se redirecciona a la vista 'dashboard' correcta.
 */
class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'dardila@unicauca.edu.co',
      password: 'simon314',
      isLoggedIn: false,
      isVisible: false,
      adminDashboard: false,
      userDashboard: false,
      alertVariant: '',
      message: '',
      showAlert: false,
      showForget:false,
      show: false
    };
  }
    handleClose = () => {
    this.setState(
      {
        showForget: false
      }
    )
  }
  /**
   * handleChange: cambia el estado de la 'variable' en el state
   * por el valor asignado.
   */
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleDismiss = () => this.setState({ showAlert: false });
  handleForget=()=> this.setState({ showForget: true })
  handleCloseForget = () => {
    // mostrar mensaje usuario creado
    alert('Revise el correo en su bandeja de entrada para recuperar su password')
    this.handleClose();
  };   

  /**
   * onLogin: Valida que el formulario este correcto
   * y luego realiza la solicitud de ingreso al servidor
   * @params email, password
   * @returns la informacion del usuario si este existe. junto con el token.
   *  */

  onLogin = event => {
    event.preventDefault();
    if (this.validateForm()) {
      const { email, password } = this.state;
      axios
        .post(URL + '/users/login/', { email, password })
        .then(response => {
          this.setState({ isLoggedIn: true });
          this.saveUserInfo(response.data);
        })
        .catch(error => {
          this.setState({
            showAlert: true,
            alertVariant: 'danger',
            message: JSON.parse(error.request.response).detail
          });
        });
    } else {
      this.setState({
        isVisible: true,
        alertVariant: 'warning',
        message: 'Ingrese todos los datos.'
      });
    }
  };

  /**
   * @param data: el cual tiene los datos del usuario. email, toke, username y los guarda
   * en el localStorage del navegador.
   * finaliza otorgando el role al usuario.
   */
  saveUserInfo = data => {
    localStorage.setItem('email', JSON.stringify(data.user.email));
    localStorage.setItem('token', JSON.stringify(data.token));
    localStorage.setItem('user', JSON.stringify(data.user.username));
    localStorage.setItem('first_name', JSON.stringify(data.user.first_name));
    localStorage.setItem('last_name', JSON.stringify(data.user.last_name));
    let role;
    role =
      data.user.is_staff === true ? (role = 'is_staff') : (role = 'is_simple');
    localStorage.setItem('role', JSON.stringify(role));
    if (role === 'is_staff') {
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
    this.source.cancel('cancel request');
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
              <Modal show={this.state.showForget} onHide={this.handleClose}>
          <ForgetPassword 
            handleCloseForget={this.handleCloseForget}
            handleClose={this.handleClose}>

          </ForgetPassword>
        </Modal>
        <div className='app-secretary container-login'>
          <div className='center'>
            <header className='app-header'></header>
            <div className='content-caja d-flex justify-content-center'>
              <div className='caja'>
                <Form onSubmit={this.onLogin}>
                  <div className='justify-content-center d-flex containt-logo'>
                    <div className='logo-sge'></div>
                  </div>
                  <Form.Label className='mb-0'>
                    <h3 className='title-login mt-2'>Iniciar Sesión</h3>
                  </Form.Label>
                  <Form.Control
                    className='mb-2'
                    type='text'
                    name='email'
                    value={this.state.email}
                    onChange={this.handleChange}
                    placeholder='Usuario'
                    required
                  />
                  <Form.Control
                    className='mb-2'
                    type='password'
                    name='password'
                    value={this.state.password}
                    onChange={this.handleChange}
                    placeholder='Contraseña'
                    required
                  />
                  <a href="#" className="link" onClick={this.handleForget}>
                    Olvide mi contraseña
                  </a>{" "}
                  <br />
                  <Button variant='primary' type='submit'>
                    Ingresar
                  </Button>
                </Form>
              </div>
            </div>
            <div className='footer-login p-3'>
              <span>
                2019 | División de las Tecnologías de la Información y las
                Comunicaciones
              </span>
              <br />
              <span>Universidad del Cauca | clindesignunicauca@gmail.com</span>
              <br />
              <span>Version 1.0</span>
            </div>
          </div>
          <div className='no-login time'>
            <Alert
              variant='danger'
              show={this.state.showAlert}
              onClose={this.handleDismiss}
              dismissible>
              <p className='mb-0'>{this.state.message}</p>
            </Alert>
          </div>
          <div className='antorcha'></div>
          <div className='bandera'></div>
        </div>
      </>
    );
  }
}

export default SignIn;
