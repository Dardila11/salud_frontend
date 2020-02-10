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
import { getHeader } from "../../utils/utils";
var moment = require('moment');

/**
 * @var schema Crear un objecto Yup el cual se encarga de todas las
 * validaciones de los campos del formulario
 */
const schema = Yup.object({
  limitAccessDate: Yup.date()
    .required('Campo Requerido')
    .min(new Date(), 'la fecha debe ser mayor al dia de hoy'),
  RolInProject: Yup.number()
    .required('Campo Requerido')
    .min(0, 'Debe escoger al menos un rol')
});

class UpdateMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      cargar: true,
      nombreCompleto: "",
      memberInfo: props.memberInfo,
      memberPermissions: [],
      technicianPermissions: ['change_registry'],
      investigatorPermissions: [
        'change_analysis',
        'change_observer',
        'change_registry'
      ],
      managerPermissions: ['change_observer'],
      suggestions: [],
      progress: false,
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

  handleCloseUpdateMember = () => {
    this.props.handleCloseUpdateMember();
  };
  removeMemberPermissions = () => {
    // recorremos todos los permisos
    var permissionToSave = [];


   for (let i = 0; i < this.state.memberPermissions.length; i++) { /*
      for (let j = 0; j < this.state.projectPermissions.length; j++)
        if (this.state.memberPermissions[i].permission_id__codename ==this.state.projectPermissions[j].name) {
          if(this.state.projectPermissions[j].checked ==true)
          {

          }
        }
        */
      for (let j = 0; j < this.state.componentPermissions.length; j++)
        if (
          this.state.memberPermissions[i].permission_id__codename ==
          this.state.componentPermissions[j].name
        ) {
          this.state.componentPermissions[j].checked = true;
        }
      for (let j = 0; j < this.state.registryPermissions.length; j++)
        if (
          this.state.memberPermissions[i].permission_id__codename ==
          this.state.registryPermissions[j].name
        ) {
          this.state.registryPermissions[j].checked = true;
        }

    }

    
    return permissionToSave;
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
      study_instance: this.props.id,
      study: {
        user_id: this.state.memberInfo.id,
        study_id: this.props.study_id,
        role: values.RolInProject,
        date_maxAccess: moment(values.limitAccessDate).format('YYYY-MM-DD'),
        is_manager: 3
      },
      permissions_add: this.saveMemberPermissions(values.RolInProject),
      permission_remove:this.removeMemberPermissions()
    };
    console.log(JSON.stringify(json));
    this.setState({ progress: true }, () => {
      axios
        .put(URL + '/studies/user/', json, {
          headers: headers
        })
        .then(() => {
          this.setState({ progress: false });
          this.handleCloseUpdateMember();
        })
        .catch(error => {
          this.setState({
            progress: false,
            alertVariant: 'danger',
            alertMessage: 'JSON.parse(error.request.response).detail'
          });
          Utils.showAlert(this.state.alertId);
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
  getPermissionsById = async id => {
    const headers = getHeader();
    const { study_id } = id;
    this.setState({ loading: true }, () =>
      axios
        .get(URL + "/studies/user/permissions/" + id, { headers: headers })
        .then(response => {
          this.setState(
            {
              memberPermissions: response.data,
              loading: false
            },
            () => {
              this.obtainMemberPermissions();
              //console.log(this.state.memberPermissions)
            }
          );
        })
        .catch(() => this.setState({ loading: false }))
    );
  };
  obtainMemberPermissions = () => {
    // recorremos todos los permisos
    //console.log(this.state.memberPermissions)
    for (let i = 0; i < this.state.memberPermissions.length; i++) {
      for (let j = 0; j < this.state.projectPermissions.length; j++)
        if (
          this.state.memberPermissions[i].permission_id__codename ==
          this.state.projectPermissions[j].name
        ) {
          this.state.projectPermissions[j].checked = true;
        }
      for (let j = 0; j < this.state.componentPermissions.length; j++)
        if (
          this.state.memberPermissions[i].permission_id__codename ==
          this.state.componentPermissions[j].name
        ) {
          this.state.componentPermissions[j].checked = true;
        }
      for (let j = 0; j < this.state.registryPermissions.length; j++)
        if (
          this.state.memberPermissions[i].permission_id__codename ==
          this.state.registryPermissions[j].name
        ) {
          this.state.registryPermissions[j].checked = true;
        }

    }
    this.setState({
      cargar: false
    });
  };
  UNSAFE_componentWillMount() {
    this.getPermissionsById(this.props.id);
  }
componentDidMount(){
  console.log(this.state.memberInfo)
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
            renderTech: false,
            nameMember:
              this.state.memberInfo.user_id__first_name +
              " " +
              this.state.memberInfo.user_id__last_name,
            endDate: Utils.getDateFormat(this.state.memberInfo.date_maxAccess),
            limitAccessDate: getDateFormat(new Date()),
            RolInProject: this.props.memberInfo.role,
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
                  Actualizar integrante del proyecto
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form id='formUpdateMemberToProject' onSubmit={handleSubmit}>
                  <Form.Group as={Col} md='4'>
                    <h4>{values.nameMember}</h4>
                  </Form.Group>
                  <Form.Row>
                    <Form.Group as={Col} md='5' controlId='limitAccessDate'>
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
                      <Form.Control.Feedback type='invalid'>
                        {errors.RolInProject}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                      <Form.Label> Permisos: </Form.Label> 
                  </Form.Row>
                  <Form.Row
                    className={values.RolInProject != -1 ? '' : 'hidden'}>
                    <Form.Group
                      className={values.RolInProject != 3 ? '' : 'hidden'}
                      as={Col}
                      md='3'>

                       
                      <Form.Label>Proyecto: </Form.Label>
                      {/* recorre los permisos de proyecto. para cada permiso 
                          lo compara con los permisos segun sea el rol seleccionado.
                       */}

                      {this.state.projectPermissions.map(permission => {
                        var check = false;
                        switch (''+values.RolInProject) {
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
                             * Para el tecnico no se renderiza el label, por ahora
                             * lo dejaré asi
                             */

                            /**
                             * Si el rol es investigador o tecnico, busca en el array
                             * si exsite el permiso con el que está comparando.
                             * Sí este exsite, lo muestra.
                             * Se deja por si en un futuro cambian los permisos del tecnico.
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
                           * asi que crear un nuevo checkbox con los datos del permiso. su id,
                           * nombre, label y el valor del checked.
                           */
                          return (
                            <Form.Check
                              id={permission.id}
                              key={permission.id}
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
                    <Form.Group as={Col} md='3'>
                      <Form.Label>Registro: </Form.Label>
                      {this.state.registryPermissions.map(permission => {
                        var check = false;
                        switch (''+values.RolInProject) {
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
                              key={permission.id}
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
                    <Form.Group
                      className={
                        values.RolInProject == 3 || values.RolInProject == 2
                          ? 'hidden'
                          : ''
                      }
                      as={Col}
                      md='3'>
                      <Form.Label>Componentes: </Form.Label>
                      {this.state.componentPermissions.map(permission => {
                        var check = false;
                        switch (''+values.RolInProject) {
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
                              key={permission.id}
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
                <Button form='formUpdateMemberToProject' type='submit'>
                  Actualizar Integrante
                </Button>
              </Modal.Footer>
            </>
          )}
        </Formik>
      </>
    );
  }
}

export default UpdateMember;
