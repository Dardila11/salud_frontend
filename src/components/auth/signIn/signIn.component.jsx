import React, { Component } from 'react';
import axios from 'axios';

import { Button, Form, Modal } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import { showAlert } from '../../utils/utils';
import { URL } from '../../utils/URLSever';
import ValidateEmail from '../../utils/utils';
import AlertComponent from '../../layout/alert/alert.component';
import ForgetPassword from './forgetPassword/forgetPassword.component';
import FooterLogin from '../../layout/footer-login/footer-login.component';

import './signIn.styles.css';

/**
 * @author Dardila
 * @description Este componente se encarga del ingreso a la aplicación.
 */
class SignIn extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      adminDashboard: false,
      userDashboard: false,
      alertVariant: '',
      alertMessage: '',
      alertId: 'alert-singIn',
      fatherEmail: '',
      isVisibleForgetPassword: false
    };
  }

  /**
   * Cambia el estado de la variable `event.target.name`
   */
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  /**
   * Cierra todas las ventanas modales
   */
  handleClose = () => this.setState({ isVisibleForgetPassword: false });

  handleOpenForgetPassword = () => {
    this.setState({ isVisibleForgetPassword: true });
  };

  handleCloseForgetPassword = () => {
    this.setState({
      isVisibleForgetPassword: false,
      alertVariant: 'success',
      alertMessage: 'Revisa la bandeja de entrada de tu correo.'
    });
    showAlert();
  };

  /**
   * Valida que el formulario este correcto y luego realiza la solicitud de ingreso al servidor
   * @params `email`, `password`
   * @returns la información del usuario si este existe, junto con el token.
   */
  onLogin = event => {
    event.preventDefault();
    const { email, password } = this.state;
    axios
      .post(
        URL + '/users/login/',
        { email, password },
        { cancelToken: this.source.token }
      )
      .then(response => {
        this.saveUserInfo(response.data);
      })
      .catch(error => {
        this.setState({
          alertVariant: 'danger',
          alertMessage: JSON.parse(error.request.response).detail
        });
        showAlert(this.state.alertId);
      });
  };

  /**
   * Guarda la información del usuario en el `localStorage` proveniente de `data`
   * @param data
   */
  saveUserInfo = data => {
    localStorage.setItem('id', JSON.stringify(data.user.id));
    localStorage.setItem('email', JSON.stringify(data.user.email));
    localStorage.setItem('token', JSON.stringify(data.token));
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
    if (
      this.props.match.params.em &&
      ValidateEmail(this.props.match.params.em)
    ) {
      this.setState({
        fatherEmail: this.props.match.params.em
      });
      this.handleOpenForgetPassword();
    }
  }

  /**
   * Cancela todas las solicitudes `axios` al cerrar el ciclo de vida del componente
   */
  componentWillUnmount() {
    this.source.cancel('cancel request');
  }

  render() {
    if (this.state.adminDashboard) {
      localStorage.setItem('tab', 1);
      return <Redirect to='/admin' />;
    } else if (this.state.userDashboard) {
      return <Redirect to='/user' />;
    }
    return (
      <section>
        <Modal
          show={this.state.isVisibleForgetPassword}
          onHide={this.handleClose}
        >
          <ForgetPassword
            email={this.state.fatherEmail}
            handleCloseForgetPassword={this.handleCloseForgetPassword}
            handleClose={this.handleClose}
          ></ForgetPassword>
        </Modal>
        <div className='app-all container-unicauca'>
          <div className='center'>
            <div className='content-box d-flex justify-content-center'>
              <div className='box'>
                <Form onSubmit={this.onLogin}>
                  <div className='justify-content-center d-flex containt-logo'>
                    <div className='logo-clindesign'></div>
                  </div>
                  <Form.Label className='mb-0'>
                    <h3 className='title-login mt-2'>Iniciar Sesión</h3>
                  </Form.Label>
                  <Form.Control
                    className='mb-2'
                    type='email'
                    name='email'
                    value={this.state.email}
                    onChange={this.handleChange}
                    placeholder='Correo'
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
                  <button
                    type='button'
                    className='button-link'
                    onClick={this.handleOpenForgetPassword}
                  >
                    Olvide mi contraseña
                  </button>{' '}
                  <br />
                  <Button variant='primary' type='submit'>
                    Ingresar
                  </Button>
                </Form>
              </div>
            </div>
            <FooterLogin></FooterLogin>
          </div>
          <AlertComponent
            alertId={this.state.alertId}
            alertVariant={this.state.alertVariant}
            alertMessage={this.state.alertMessage}
          ></AlertComponent>
          <div className='antorcha'></div>
          <div className='bandera'></div>
        </div>
      </section>
    );
  }
}

export default SignIn;
