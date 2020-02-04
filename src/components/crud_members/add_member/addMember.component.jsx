import React, { Component } from 'react';
import axios from 'axios';
import { ProgressBar, Modal, Form, Col, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { URL } from '../../utils/URLSever';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import * as Utils from '../../utils/utils';
import * as Yup from 'yup';
import matchSorter from 'match-sorter';
import { getDateFormat } from '../../utils/utils';
var moment = require('moment');

/**
 * @var schema Crear un objecto Yup el cual se encarga de todas las
 * validaciones de los campos del formulario
 */
const schema = Yup.object({
  idMember: Yup.string().required('Campo Requerido')
});

class AddMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      technicianPermissions: ['change_registry'],
      investigatorPermissions: [
        'change_analysis',
        'change_observer',
        'change_registry'
      ],
      managerPermissions: ['change_observer'], // dice que change_observer no es un permiso
      suggestions: [],
      progress: false,
      empty: false,
      alertMessage: '',
      alertVariant: '',
      alertId: 'alert-add-member-to-project',
      projectPermissions: [
        {
          num: 0,
          id: 'checkParametrizacion',
          name: 'change_parameterization',
          key: 'change_parameterization',
          label: 'Parametrización',
          checked: false
        },
        {
          num: 0,
          id: 'checkCuestionarios',
          name: 'change_questionnaire',
          key: 'change_questionnaire',
          label: 'Cuestionarios',
          checked: false
        },
        {
          num: 0,
          id: 'checkAnalisis',
          name: 'change_analysis',
          key: 'change_analysis',
          label: 'Analisis',
          checked: false
        }
      ],
      registryPermissions: [
        {
          id: 'checkControl',
          name: 'change_control',
          key: 'change_control',
          label: 'Control General',
          checked: false
        },
        {
          id: 'checkRegistro',
          name: 'change_registry',
          key: 'change_registry',
          label: 'Registro Individual',
          checked: false
        },
        {
          id: 'checkVisor',
          name: 'change_observer',
          key: 'change_observer',
          label: 'Visor General',
          checked: false
        }
      ],
      componentPermissions: [
        {
          id: 'checkIntegrante',
          name: 'change_member',
          key: 'change_member',
          label: 'Integrante',
          checked: false
        },
        {
          id: 'checkCentros',
          name: 'change_centerStudy',
          key: 'change_centerStudy',
          label: 'Centros',
          checked: false
        }
      ]
    };
  }

  handleClose = () => {
    this.props.handleClose();
  };

  handleCloseAddMember = () => {
    this.props.handleCloseAddMember();
  };

  saveMemberPermissions = role => {
    // recorremos todos los permisos
    var permissionToSave = [];
    for (let i = 0; i < this.state.projectPermissions.length; i++) {
      var permission = [...this.state.projectPermissions];
      if (permission[i].checked) {
        permissionToSave.push({ name: permission[i].name });
      }
    }
    for (let i = 0; i < this.state.registryPermissions.length; i++) {
      var permission = [...this.state.registryPermissions];
      if (permission[i].checked) {
        permissionToSave.push({ name: permission[i].name });
      }
    }
    for (let i = 0; i < this.state.componentPermissions.length; i++) {
      var permission = [...this.state.componentPermissions];
      if (permission[i].checked) {
        permissionToSave.push({ name: permission[i].name });
      }
    }

    console.log(permissionToSave);

    // para cada permiso verificamos si es un permiso del rol.
    // está checked ? lo agregamos a la lista de permisos a agregar
    // esta función retorna la lista de permisos que se van a agregar a permissions[]
    console.log('rol en el proyecto ' + role);
    return permissionToSave;
  };

  saveNewMemberInfo = values => {
    const headers = Utils.getHeader();
    var json = {
      study: {
        user_id: values.idMember.userId,
        study_id: this.props.study_id,
        role: values.RolInProject,
        date_maxAccess: moment(values.date_maxAccess).format('YYYY-MM-DD'),
        is_manager: 0
      },
      permissions: this.saveMemberPermissions(values.RolInProject)
    };
    console.log(JSON.stringify(json));
    this.setState({ progress: true }, () => {
      axios
        .post(URL + '/studies/user/', json, {
          headers: headers
        })
        .then(() => {
          this.setState({ progress: false });
          this.handleCloseAddMember();
        })
        .catch(error => {
          /*this.setState({
            progress: false,
            alertVariant: 'danger',
            alertMessage: JSON.parse(error.request.response).detail
          });
          Utils.showAlert(this.state.alertId);*/
        });
    });
  };

  handleResetCheckbox = () => {
    for (let i = 0; i < this.state.projectPermissions.length; i++) {
      var updateCheck = [...this.state.projectPermissions];
      if (updateCheck[i].checked) {
        updateCheck[i].checked = false;
      }
      this.setState({ updateCheck });
    }
    for (let i = 0; i < this.state.registryPermissions.length; i++) {
      var updateCheck = [...this.state.registryPermissions];
      if (updateCheck[i].checked) {
        updateCheck[i].checked = false;
      }
      this.setState({ updateCheck });
    }
    for (let i = 0; i < this.state.componentPermissions.length; i++) {
      var updateCheck = [...this.state.componentPermissions];
      if (updateCheck[i].checked) {
        updateCheck[i].checked = false;
      }
      this.setState({ updateCheck });
    }
  };

  /**
   * handleCheck se encarga de cambiar el estado del checkbox que se ha clickeado.
   * para ello necesita el id y el nombre del array (ej: registryPermissions )
   */
  handleCheck = (permissionArray, id, arrayName) => {
    // en name guardamos el array "this.state.arrayName" <- (ej: this.state.registryPermissions)
    var name = 'this.state.' + arrayName;
    // usamos eval para pasar de un String a una variable
    name = eval(name);
    // obtenemos todos los datos del array.
    var newData = [...name];
    console.log(newData);
    // buscamos el checkbox que tiene el id que queremos cambiar
    var index = newData.findIndex(obj => obj.id === id);
    // comparamos el valor de checked
    if (newData[index].checked) {
      newData[index].checked = false;
    } else {
      newData[index].checked = true;
    }
    // por ultimo actualizamos el checkbox con la nueva informacion de checked
    this.setState({ newData });
  };

  componentDidMount() {
    console.log(this.props.usersInfo);
  }

  render() {
    return (
      <>
        {this.state.progress ? (
          <ProgressBar
            className='progress'
            animated
            now={100}
            id='progress-admin'
          />
        ) : (
          <></>
        )}
        <Formik
          noValidate
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{
            idMember: '',
            limitAccessDate: getDateFormat(new Date()),
            RolInProject: -1,
            permissions: []
          }}
          validationSchema={schema}
          onSubmit={this.saveNewMemberInfo}>
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            errors,
            setFieldValue
          }) => (
            <>
              <Modal.Header closeButton>
                <Modal.Title className='h3 text-gray-800 mb-0'>
                  Agregar integrante al proyecto
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  <i className='required'>Todos los campos son obligatorios</i>
                </p>
                <Form id='formAddMemberToProject' onSubmit={handleSubmit}>
                  <Form.Row>
                    <Form.Group as={Col} md='4' controlId='inputId'>
                      <Form.Label> Nuevo integrante</Form.Label>
                      <Autocomplete
                        id='combo-box-demo'
                        options={this.props.usersInfo}
                        getOptionLabel={option =>
                          typeof option === 'string'
                            ? option
                            : Utils.toCapitalizer(option.userName)
                        }
                        style={{ width: 300 }}
                        renderOption={option => (
                          <React.Fragment>
                            <div>
                              <span>{option.userEmail}</span>
                              <br />
                              <span>
                                {Utils.toCapitalizer(option.userName)}
                              </span>
                              <hr />
                            </div>
                          </React.Fragment>
                        )}
                        value={values.idMember}
                        name='idMember'
                        onChange={(e, value) => {
                          setFieldValue('idMember', value);
                        }}
                        filterOptions={(options, { inputValue }) =>
                          matchSorter(options, inputValue, {
                            keys: ['userName']
                          })
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            name='idMember'
                            variant='outlined'
                            fullWidth
                            helperText={touched.idMember ? errors.idMember : ''}
                            error={touched.idMember && Boolean(errors.idMember)}
                          />
                        )}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.idMember}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md='4' controlId='limitAccessDate'>
                      <Form.Label>Fecha limite de acceso </Form.Label>
                      <Form.Control
                        type='Date'
                        value={values.limitAccessDate}
                        onChange={handleChange}
                        locale='es'
                        className='form-control'
                        name='limitAccessDate'
                        isValid={
                          touched.limitAccessDate && !errors.limitAccessDate
                        }
                        isInvalid={!!errors.limitAccessDate}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.limitAccessDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md='5' controlId='validationFormik01'>
                      <Form.Label>Rol en el proyecto</Form.Label>
                      <Form.Control
                        as='select'
                        name='RolInProject'
                        value={values.RolInProject}
                        onChange={e => {
                          handleChange(e);
                          // se resetean todos los valores de los checkbox
                          this.handleResetCheckbox();
                        }}
                        isInvalid={!!errors.RolInProject}
                        isValid={touched.RolInProject && !errors.RolInProject}>
                        <option value={-1}>---</option>
                        <option value={1}>Gestor</option>
                        <option value={2}>Investigador</option>
                        <option value={3}>Técnico</option>
                      </Form.Control>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row
                    className={values.RolInProject != -1 ? '' : 'hidden'}>
                    <Form.Group as={Col} md='4'>
                      <Form.Label>Permisos de proyecto: </Form.Label>
                      {/* recorre los permisos de proyecto. para cada permiso 
                          lo compara con los permisos segun sea el rol seleccionado.
                       */}
                      {this.state.projectPermissions.map(permission => {
                        var check = false;
                        switch (values.RolInProject) {
                          case '1': // Gestor
                            check = true;
                            /**
                             * Para este caso del gestor, busca en el array
                             * si existe el permiso con el que está comparando.
                             * Sí este existe, NO lo muestra. 'check = false'
                             */
                            this.state.managerPermissions.filter(
                              mPermission => {
                                if (mPermission == permission.name) {
                                  check = false;
                                }
                              }
                            );
                            break;
                          case '2': // Investigator
                            /**
                             * Si el rol es investigador o tecnico, busca en el array
                             * si exsite el permiso con el que está comparando.
                             * Sí este exsite, lo muestra.
                             */
                            this.state.investigatorPermissions.filter(
                              invPermission => {
                                if (invPermission == permission.name) {
                                  check = true;
                                }
                              }
                            );
                            break;
                          case '3': // Tecnico
                            /**
                             * Si el rol es investigador o tecnico, busca en el array
                             * si exsite el permiso con el que está comparando.
                             * Sí este exsite, lo muestra.
                             */
                            this.state.technicianPermissions.filter(
                              techPermission => {
                                if (techPermission == permission.name) {
                                  check = true;
                                }
                              }
                            );
                            break;
                        }
                        if (check) {
                          /**
                           * Si check es verdadero, significa que va a renderizar el checkbox
                           * asi que crear un numero checkbox con los datos del permiso. su id,
                           * nombre, label y el valor del checked.
                           */
                          return (
                            <Form.Check
                              id={permission.id}
                              name={permission.name}
                              type='checkbox'
                              label={permission.label}
                              checked={permission.checked}
                              onChange={() => {
                                this.handleCheck(
                                  permission.name,
                                  permission.id,
                                  'projectPermissions'
                                );
                              }}
                            />
                          );
                        }
                      })}
                    </Form.Group>
                    <Form.Group as={Col} md='4'>
                      <Form.Label>Permisos de registro: </Form.Label>
                      {this.state.registryPermissions.map(permission => {
                        var check = false;
                        switch (values.RolInProject) {
                          case '1': // Gestor
                            check = true;
                            this.state.managerPermissions.filter(
                              mPermission => {
                                if (mPermission == permission.name) {
                                  check = false;
                                }
                              }
                            );
                            break;
                          case '2': // Investigator
                            this.state.investigatorPermissions.filter(
                              invPermission => {
                                if (invPermission == permission.name) {
                                  check = true;
                                }
                              }
                            );
                            break;
                          case '3': // Tecnico
                            this.state.technicianPermissions.filter(
                              techPermission => {
                                if (techPermission == permission.name) {
                                  check = true;
                                }
                              }
                            );
                            break;
                        }
                        if (check) {
                          return (
                            <Form.Check
                              id={permission.id}
                              name={permission.name}
                              type='checkbox'
                              label={permission.label}
                              checked={permission.checked}
                              onChange={() => {
                                this.handleCheck(
                                  permission.name,
                                  permission.id,
                                  'registryPermissions'
                                );
                              }}
                            />
                          );
                        }
                      })}
                    </Form.Group>
                    <Form.Group as={Col} md='4'>
                      <Form.Label>Permisos de componentes: </Form.Label>
                      {this.state.componentPermissions.map(permission => {
                        var check = false;
                        switch (values.RolInProject) {
                          case '1': // Gestor
                            check = true;
                            this.state.managerPermissions.filter(
                              mPermission => {
                                if (mPermission == permission.name) {
                                  check = false;
                                }
                              }
                            );
                            break;
                          case '2': // Investigator
                            this.state.investigatorPermissions.filter(
                              invPermission => {
                                if (invPermission == permission.name) {
                                  check = true;
                                }
                              }
                            );
                            break;
                          case '3': // Tecnico
                            this.state.technicianPermissions.filter(
                              techPermission => {
                                if (techPermission == permission.name) {
                                  check = true;
                                }
                              }
                            );
                            break;
                        }
                        if (check) {
                          return (
                            <Form.Check
                              id={permission.id}
                              name={permission.name}
                              type='checkbox'
                              label={permission.label}
                              checked={permission.checked}
                              onChange={() => {
                                this.handleCheck(
                                  permission.name,
                                  permission.id,
                                  'componentPermissions'
                                );
                              }}
                            />
                          );
                        }
                      })}
                    </Form.Group>
                  </Form.Row>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={this.handleClose}>
                  Cancelar
                </Button>
                <Button form='formAddMemberToProject' type='submit'>
                  Agregar Integrante
                </Button>
              </Modal.Footer>
            </>
          )}
        </Formik>
      </>
    );
  }
}

export default AddMember;
