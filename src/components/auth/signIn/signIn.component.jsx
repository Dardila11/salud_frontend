import React, { Component } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import "./signIn.styles.css";
import { URL } from "../../utils/URLSever";

// TODO
// - Diseñar el login correctamente
// - Completar los mensajes de error (de acuerdo a la respuesta del servidor)
// - Terminar todas las funcionalidades del login: recordar contraseña, olvidé constraseña

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "mdquilindo@unicauca.edu.co",
      password: "oracle",
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
          this.setState({ isLoggedIn: true });
          this.saveUserInfo(response.data);
        })
        .catch(error => {
          console.warn(JSON.parse(error.request.response));
          this.setState({
            show: true,
            alertVariant: "danger",
            message: JSON.parse(error.request.response).detail
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
      return <Redirect to="/admin" />;
    } else if (this.state.userDashboard) {
      return <Redirect to="/user" />;
    }
    const handleDismiss = () => this.setState({ show: false });
    return (
      <>
        <div className="app-secretary container-login">
          <div className="center">
            <header className="app-header">
              {/* <img src={logo} alt="logo" /> */}
            </header>
            <div className="content-caja d-flex justify-content-center">
              <div className="caja">
                <Form onSubmit={this.onLogin}>
                  <div className="justify-content-center d-flex containt-logo">
                    <div className="logo-sge"></div>
                  </div>
                  {/* <span className="SGE">ClinDesign</span><br /> */}
                  <Form.Label className="mb-0">
                    <h3 className="title-login mt-2">Iniciar Sesión</h3>
                  </Form.Label>
                  <Form.Control
                    className="mb-2"
                    type="text"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    placeholder="Usuario"
                    required
                  />
                  <Form.Control
                    className="mb-2"
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    placeholder="Contraseña"
                    required
                  />
                  <a href="#home" className="link">
                    Olvide mi contraseña
                  </a>{" "}
                  <br />
                  <Button variant="primary" type="submit">
                    Ingresar
                  </Button>
                </Form>
              </div>
            </div>
            <div className="footer-login p-3">
              <span>
                2019 | División de las Tecnologías de la Información y las
                Comunicaciones
              </span>
              <br />
              <span>
                Universidad del Cauca | clindesignunicauca@gmail.com
              </span>{" "}
              <br />
              <span>Version 1.0</span>
            </div>
          </div>
          <div className="no-login time">
            <Alert
              variant="danger"
              show={this.state.show}
              onClose={handleDismiss}
              dismissible>
              <p className="mb-0">{this.state.message}</p>
            </Alert>
          </div>
          <div className="antorcha"></div>
          <div className="bandera"></div>
        </div>
      </>
    );
  }
}

export default SignIn;
