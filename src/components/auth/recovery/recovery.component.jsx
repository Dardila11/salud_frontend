import React, { Component } from 'react';
import axios from 'axios';

import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { Redirect } from 'react-router-dom';
import * as Yup from 'yup';

import { showAlert } from '../../utils/utils';
import { URL } from '../../utils/URLSever';
import AlertComponent from '../../layout/alert/alert.component';
import FooterLogin from '../../layout/footer-login/footer-login.component';

const schema = Yup.object({
  pass1: Yup.string().min(6, 'Contraseña debe tener minimo 6 caracteres'),
  pass2: Yup.string().oneOf([Yup.ref('pass1'), null], 'Contraseña no coincide')
});

/**
 * @author Dardila
 * @description Este componente se encarga de cambiar la contraseña.
 */
class Recovery extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      isSuccess: false,
      alertVariant: '',
      alertMessage: ''
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  /**
   * Valida que el formulario este correcto y luego realiza la solicitud de ingreso al servidor
   * @params `token`, `password`
   * @returns la informacion del usuario si este existe. junto con el token.
   *  */
  savePassword = async values => {
    var token = this.props.match.params.tk;
    axios
      .post(URL + '/users/password/' + token + '/', {
        password: values.pass1
      })
      .then(response => {
        alert(response.data.detail);
        this.setState({ isSuccess: true });
      })
      .catch(error => {
        this.setState({
          alertVariant: 'danger',
          alertMessage: JSON.parse(error.request.response).detail
        });
        showAlert();
      });
  };

  componentWillUnmount() {
    this.source.cancel('cancel request');
  }

  render() {
    if (this.state.isSuccess) {
      return <Redirect to='/' />;
    }
    return (
      <section>
        <Formik
          noValidate
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{
            pass1: '',
            pass2: ''
          }}
          validationSchema={schema}
          onSubmit={this.savePassword}
        >
          {({ handleSubmit, handleChange, values, touched, errors }) => (
            <div className='app-all container-unicauca'>
              <div className='center'>
                <header className='app-header'></header>
                <div className='content-box d-flex justify-content-center'>
                  <div className='box'>
                    <Form id='formUpdateUserPass' onSubmit={handleSubmit}>
                      <div className='justify-content-center d-flex containt-logo'>
                        <div className='logo-clindesign'></div>
                      </div>
                      <Form.Label className='mb-0'>
                        <h3 className='title-login mt-2'>
                          Restablecer Contraseña
                        </h3>
                      </Form.Label>
                      <Form.Group
                        controlId='validationFormik01'
                        className='mb-2'
                      >
                        <Form.Control
                          type='password'
                          name='pass1'
                          value={values.pass1}
                          onChange={handleChange}
                          isInvalid={!!errors.pass1}
                          isValid={touched.pass1 && !errors.pass1}
                          placeholder='Contraseña'
                          required
                        ></Form.Control>
                        <Form.Control.Feedback type='invalid'>
                          {errors.pass1}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        controlId='validationFormik02'
                        className='mb-2'
                      >
                        <Form.Control
                          type='password'
                          name='pass2'
                          value={values.pass2}
                          onChange={handleChange}
                          isInvalid={!!errors.pass2}
                          isValid={touched.pass2 && !errors.pass2}
                          placeholder='Repetir contraseña'
                          required
                        ></Form.Control>
                        <Form.Control.Feedback type='invalid'>
                          {errors.pass2}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button variant='primary' type='submit'>
                        Restablecer
                      </Button>
                    </Form>
                  </div>
                </div>
                <FooterLogin></FooterLogin>
              </div>
              <AlertComponent
                alertVariant={this.state.alertVariant}
                alertMessage={this.state.alertMessage}
              ></AlertComponent>
              <div className='antorcha'></div>
              <div className='bandera'></div>
            </div>
          )}
        </Formik>
      </section>
    );
  }
}

export default Recovery;
