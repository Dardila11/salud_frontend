import React, { Component } from 'react';
import axios from 'axios';

import { ListGroup, Form, Button } from 'react-bootstrap';
import AlertComponent from '../alert/alert.component';
import { Formik } from 'formik';
import { getHeader, showAlert } from '../../utils/utils';
import { URL } from '../../utils/URLSever';

import * as Yup from 'yup';

const schema = Yup.object({
  pass1: Yup.string().min(6, 'Mínimo 6 caracteres'),
  pass2: Yup.string().oneOf([Yup.ref('pass1'), null], 'Contraseña no coincide')
});

class ViewProfile extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      initialValues: {
          pass1: '',
          pass2: ''
      },
      alertVariant: '',
      alertMessage: '',
      alertId: 'alert-recovery'
    };
  }

  savePassword = values => {
    const token = JSON.parse(localStorage.getItem('token'));
    this.setState({ progress: true }, () => {
      axios
        .post(URL + '/users/password/' + token + '/', {
          password: values.pass1
        })
        .then(response => {
            this.setState({
                pass1: '',
                pass2: '',
                alertVariant: 'success',
                alertMessage: 'Contraseña actualizada'
              });
              this.setState({ progress: false });
              showAlert(this.state.alertId);
        })
        .catch(error => {
          this.setState({
            alertVariant: 'danger',
            alertMessage: JSON.parse(error.request.response).detail
          });
          this.setState({ progress: false });
          showAlert(this.state.alertId);
        });
    });
  };

  getUser = () => {
    const email = JSON.parse(localStorage.getItem('email'));
    const headers = getHeader();
    this.setState({ loading: true }, () =>
      axios
        .get(
          URL + '/users/' + email,
          { headers: headers },
          { cancelToken: this.source.token }
        )
        .then(response => {
          this.setState({
            user: response.data[0],
            loading: false
          });
        })
        .catch(() => this.setState({ loading: false }))
    );
  };

  renderProfile = () => {
    let profile = <></>;
    if (this.state.user !== null) {
      profile = (
        <section>
          <ListGroup>
            <ListGroup.Item variant='dark'>
              <h5 className='mb-0'>
                {this.state.user.is_staff ? 'Administrador' : 'Simple'}
              </h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <span className='cap'>{this.state.user.first_name}</span>{' '}
              <span className='cap'>{this.state.user.last_name}</span>
            </ListGroup.Item>
            <ListGroup.Item>{this.state.user.email}</ListGroup.Item>
            <ListGroup.Item>
              <span>
                <b>Centro médico: </b>
                <span className='cap'>{this.state.user.my_center__name}</span>
              </span>
            </ListGroup.Item>
            <ListGroup.Item>
              <span>
                <b>Departamento: </b>
                <span className='cap'>
                  {this.state.user.my_department__name}
                </span>
              </span>
            </ListGroup.Item>
            <ListGroup.Item>
              <Formik
                
                noValidate
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={{
                  pass1: '',
                  pass2: ''
                }}
                validationSchema={schema}
                onSubmit={this.savePassword}>
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                  <Form id='formUpdateUserPass' onSubmit={handleSubmit}>
                    <Form.Label className='mb-0'>
                      <h3 className='title-login mt-2'>
                        Restablecer Contraseña
                      </h3>
                    </Form.Label>
                    <Form.Group controlId='validationFormik01' className='mb-2'>
                      <Form.Control
                        type='password'
                        name='pass1'
                        value={values.pass1}
                        onChange={handleChange}
                        isInvalid={!!errors.pass1}
                        isValid={touched.pass1 && !errors.pass1}
                        placeholder='Contraseña'
                        required></Form.Control>
                      <Form.Control.Feedback type='invalid'>
                        {errors.pass1}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId='validationFormik02' className='mb-2'>
                      <Form.Control
                        type='password'
                        name='pass2'
                        value={values.pass2}
                        onChange={handleChange}
                        isInvalid={!!errors.pass2}
                        isValid={touched.pass2 && !errors.pass2}
                        placeholder='Repetir contraseña'
                        required></Form.Control>
                      <Form.Control.Feedback type='invalid'>
                        {errors.pass2}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Button variant='primary' type='submit'>
                      Restablecer
                    </Button>
                  </Form>
                )}
              </Formik>
            </ListGroup.Item>
          </ListGroup>
          <AlertComponent
            alertId={this.state.alertId}
            alertVariant={this.state.alertVariant}
            alertMessage={this.state.alertMessage}
          />
        </section>
      );
    }
    return profile;
  };

  componentDidMount() {
    this.getUser();
  }

  render() {
    return <this.renderProfile />;
  }
}

export default ViewProfile;
