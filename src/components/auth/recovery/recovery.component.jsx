import { Formik } from "formik";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import React, { Component } from "react";
import axios from "axios";
import { Form, Button, Alert, Col } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import "./recovery.styles.css";
import { URL } from "../../utils/URLSever";
import * as Yup from "yup";

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

/**
 * @var schema Crear un objecto Yup el cual se encarga de todas las
 * validaciones de los campos del formulario
 */
const schema = Yup.object({
  pass1: Yup.string()
    .min(6, "Contraseña debe tener minimo 6 caracteres")
    .required("Campo Requerido"),
  pass2: Yup.string()
    .oneOf([Yup.ref("pass1"), null], "Contraseña no coinciden")
    .required("Campo Requerido")
});

class Recovery extends Component {
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
      showAlert: false,
      isSuccessfull: false
    };
  }
  /**
   * handleChange: cambia el estado de la 'variable' en el state
   * por el valor asignado.
   */
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleDismiss = () => this.setState({ showAlert: false });
  handleSubmit = () => {};

  /**
   * onLogin: Valida que el formulario este correcto
   * y luego realiza la solicitud de ingreso al servidor
   * @params email, password
   * @returns la informacion del usuario si este existe. junto con el token.
   *  */
  saveNewUserPass = async values => {
    var token = this.props.match.params.tk;
    console.log("el token es " + token);
    var json = {
      password: values.pass1
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "JWT " + token
    };
    axios
      .post(URL + "/users/password/" + token + "/", json, {
        password: values.pass1
      })
      .then(response => {
        alert("Contraseña restablecida con exito");
        this.setState({ isSuccessfull: true });
      })
      .catch(error => {
        alert(error.response.data);
      });
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
    if (this.state.isSuccessfull) {
      return <Redirect to="/" />;
    }
    return (
      <>
        <Formik
          noValidate
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{
            pass1: "",
            pass2: ""
          }}
          validationSchema={schema}
          onSubmit={this.saveNewUserPass}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors
          }) => (
            <>
              <div className="app-secretary container-login">
                <div className="center">
                  <header className="app-header"></header>
                  <div className="content-caja d-flex justify-content-center">
                    <div className="caja">
                      <Form id="formUpdateUserPass" onSubmit={handleSubmit}>
                        <div className="justify-content-center d-flex containt-logo">
                          <div className="logo-sge"></div>
                        </div>
                        <Form.Label className="mb-0">
                          <h3 className="title-login mt-2">
                            Restablecer Contraseña
                          </h3>
                        </Form.Label>

                        <Form.Group
                          controlId="validationFormik01"
                          className="mb-2"
                        >
                          <Form.Control
                            type="password"
                            name="pass1"
                            value={values.pass1}
                            onChange={handleChange}
                            isInvalid={!!errors.pass1}
                            isValid={touched.pass1 && !errors.pass1}
                            placeholder="Contraseña"
                          ></Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.pass1}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          controlId="validationFormik02"
                          className="mb-2"
                        >
                          <Form.Control
                            type="password"
                            name="pass2"
                            value={values.pass2}
                            onChange={handleChange}
                            isInvalid={!!errors.pass2}
                            isValid={touched.pass2 && !errors.pass2}
                            placeholder="Repetir contraseña"
                          ></Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.pass2}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                          Restablecer
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
                    </span>
                    <br />
                    <span>Version 1.0</span>
                  </div>
                </div>
                <div className="antorcha"></div>
                <div className="bandera"></div>
              </div>
            </>
          )}
        </Formik>
      </>
    );
  }
}

export default Recovery;
