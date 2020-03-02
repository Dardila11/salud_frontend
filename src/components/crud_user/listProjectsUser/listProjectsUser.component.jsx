import React, { Component } from 'react';
import axios from 'axios';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import ReactTable from 'react-table';
import matchSorter from 'match-sorter';

import { getHeader, showAlert } from '../../utils/utils';
import { URL } from '../../utils/URLSever';
import AlertComponent from '../../layout/alert/alert.component';

import 'react-table/react-table.css';
import './listUsers.styles.css';

const NoDataConst = () => (
  <Loader
    type='ThreeDots'
    color='#00BFFF'
    height={100}
    width={100}
    className='mh -loading -active'
  />
);

/**
 * @author Dardila
 * @description Este componente se encarga de listar la informacion de todos los usuarios en una tabla
 * y de permitir su correspondiente CRUD
 */
class ListProjectsUser extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();
  isUpdate = true;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      emailToRead: '',
      info: [],
      projects:[],
      projectsInfo:[],
      infoCenters: [],
      infoDepartaments: [],
      userInfo: [1],
      userPermissions: [],
      isVisibleCreate: false,
      isVisibleUpdate: false,
      isVisibleDelete: false,
      alertVariant: '',
      alertMessage: '',
      alertId: 'alert-listUsers',
      columns: [
        {
          Header: 'Título',
          accessor: 'title',
          width: 150,
          maxWidth: 200,
          minWidth: 100,
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ['title'] }),
          filterAll: true,
          Cell: props => (
            <Link
              to={''}
              style={{ textTransform: 'capitalize' }}>
              {props.value}
            </Link>
          )
        },
        /* {
          Header: 'Fecha de Registro',
          accessor: 'reg_date',
          width: 150,
          maxWidth: 200,
          minWidth: 100
        }, */
        {
          Header: 'Fecha de Inicio',
          accessor: 'start_date',
          width: 150,
          maxWidth: 200,
          minWidth: 100
        },
        {
          Header: 'Fecha de Finalización',
          accessor: 'end_date',
          width: 150,
          maxWidth: 200,
          minWidth: 100
        },
        {
          id: 'status',
          Header: 'Estado',
          accessor: d => {
            switch (d.status) {
              case 1:
                return 'Registro';
              case 2:
                return 'Diseño';
              case 3:
                return 'Finalizado';
              default:
                return ''
            }
          },
          sortable: false,
          filterable: false,
          width: 100,
          maxWidth: 100,
          minWidth: 100
        },
        {
          Header: 'Acciones',
          sortable: false,
          filterable: false,
          width: 150,
          maxWidth: 150,
          minWidth: 150,
          Cell: props => {
            return (
              <>
                
                <OverlayTrigger
                  placement='right'
                  delay={{ show: 250, hide: 100 }}
                  overlay={<Tooltip>Detalles</Tooltip>}>
                  <Link
                    className='ml-1 view btn btn-outline-primary'
                    variant='outline-primary'
                    role='button'
                    to={'/admin/studies/' + props.original.id_pk}
                  />
                </OverlayTrigger>
              </>
            );
          }
        }
      ]
    };
  }

  handleCloseCreate = () => {
    this.getUsers();
    this.setState({ alertVariant: 'success', alertMessage: 'Usuario creado.' });
    this.handleClose();
    showAlert(this.state.alertId);
  };

  handleCloseDelete = () => {
    this.getUsers();
    this.setState({
      alertVariant: 'success',
      alertMessage: 'Estado del usuario modificado.'
    });
    this.handleClose();
    showAlert(this.state.alertId);
  };

  handleCloseUpdate = () => {
    this.getUsers();
    this.setState({
      alertVariant: 'success',
      alertMessage: 'Usuario actualizado.'
    });
    this.handleClose();
    showAlert(this.state.alertId);
  };

  /**
   * @function handleClose se encarga de cerrar todas los modales
   */
  handleClose = () => {
    this.setState({
      isVisibleCreate: false,
      isVisibleUpdate: false,
      isVisibleDelete: false,
      isVisibleView: false
    });
  };

  handleOpenCreate = () => {
    this.setState({ isVisibleCreate: true });
  };

  handleOpenDelete = () => {
    this.setState({ isVisibleDelete: true });
  };

  handleOpenUpdate = () => {
    this.setState({ isVisibleUpdate: true });
  };

  /**
   * @function getUserByEmail
   * @description obtiene la informacion del usuario por medio de su email.
   */

  getProjectsInfo = () => {
    var projectsInfoArray = [];
    for (let i = 0; i < this.state.projects.length; i++) {
      var id = this.state.projects[i].study_id;
      var title = this.state.projects[i].study_id__title_little;
      var reg_date = this.state.projects[i].study_id__date_reg.substring(0, 10);
      var start_date = this.state.projects[i].study_id__date_reg;
      var end_date = this.state.projects[i].date_maxAccess;
      var status = this.state.projects[i].study_id__status;
      projectsInfoArray.push({
        id_pk: id,
        title: title,
        reg_date: reg_date,
        start_date: start_date,
        end_date: end_date,
        status: status
      });
    }
    this.setState({ projectsInfo: projectsInfoArray });
  };
  getUserByEmail = async email => {
/*
    const headers = getHeader();
    await axios
      .get(
        URL + '/users/' + email,
        { headers: headers },
        { cancelToken: this.source.token }
      )
      .then(response => {
        this.setState({ userInfo: response.data }, () => {
          if (this.isUpdate) {
            this.handleOpenUpdate();
          } else {
            this.handleOpenDelete();
          }
        });
      });
*/
  };

  /**
   * @function getUserPermissions
   * @description Obtiene todos los permisos de un usuario por su email
   * @param email
   */
  getUserPermissions = async email => {
/*
    const headers = getHeader();
    await axios
      .get(
        URL + '/users/permissions/all/' + email,
        { headers: headers },
        { cancelToken: this.source.token }
      )
      .then(response => {
        this.setState({ userPermissions: response.data }, () => {
          this.getUserByEmail(email);
        });
      });
*/
  };

  /**
   * @function loadDepartaments
   * @description Obtiene todos los `Departement`
   */
  loadDepartaments = async () => {
/*
    const headers = getHeader();
    await axios
      .get(
        URL + '/places/department/all/',
        { headers: headers },
        { cancelToken: this.source.token }
      )
      .then(response => {
        this.setState({ infoDepartaments: response.data }, () => {
          this.viewDepartmentsInfo();
        });
      });
*/
  };

  /**
   * @function viewDepartmentsInfo
   * @description Formatea los `Department` en una lista
   */
  viewDepartmentsInfo = () => {
/*
    var optionsDepArray = [];
    for (let index = 0; index < this.state.infoDepartaments.length; index++) {
      var name = this.state.infoDepartaments[index].fields.name;
      var pk = this.state.infoDepartaments[index].pk;
      optionsDepArray.push({ myPk: pk, myName: name });
    }
    this.setState({ infoDepartaments: optionsDepArray });
*/
  };

  /**
   * @function loadCenters
   * @description Obtiene todos los `Center`
   */
  loadCenters = async () => {
/*
    const headers = getHeader();
    await axios
      .get(
        URL + '/places/center/all/',
        { headers: headers },
        { cancelToken: this.source.token }
      )
      .then(response => {
        this.setState({ infoCenters: response.data }, () => {
          this.viewCentersInfo();
        });
      });
*/
  };

  /**
   * @function viewCentersInfo
   * @description Formatea los `Center` en una lista
   */
  viewCentersInfo = () => {
/*
    var optionsCentersArray = [];
    for (let index = 0; index < this.state.infoCenters.length; index++) {
      var name = this.state.infoCenters[index].fields.name;
      var pk = this.state.infoCenters[index].pk;
      optionsCentersArray.push({ myPk: pk, myName: name });
    }
    this.setState({ infoCenters: optionsCentersArray });
*/
  };

  /**
   * @function getUsers
   * @description Obtiene todos los `User`
   */
  getProjects = async () => {
    const headers = getHeader();
    axios
      .get(
        URL + '/studies/user/my/' + this.props.email,
        { headers: headers },
        { cancelToken: this.source.token }
      )
      .then(response => {
        this.setState({ projects: response.data, loading: false  }, () => {
          this.getProjectsInfo();
          //this.getUserProjects()
        });
      })
      .catch(error => {
        console.log('oh no, hubo un error!');
        console.log(error.status);
      });
  };
  getUsers = async () => {
/*
    const headers = getHeader();
    this.setState({ loading: true }, () =>
      axios
        .get(
          URL + '/users/all/',
          { headers: headers },
          { cancelToken: this.source.token }
        )
        .then(response => {
          this.setState({ info: response.data, loading: false });
        })
    );
*/
  };

  /**
   * @function updateRow
   * @description Carga el modal de actualizar un usuario
   */
  updateRow = email => {
    this.isUpdate = true;
    this.setState({ emailToRead: email }, () => {
      this.getUserPermissions(this.state.emailToRead);
    });
  };

  /**
   * @function deleteRow
   * @description Carga el modal de cambiar el estado del usuario
   */
  deleteRow = email => {
    this.isUpdate = false;
    this.setState({ emailToRead: email }, () => {
      this.getUserByEmail(this.state.emailToRead);
    });
  };

  /**
   * @function componentDidMount
   * @description Carga los datos después que el componente carga
   */
  getUserProjects(){
    console.log(this.state.projects)
  }
  componentDidMount() {
    this.getProjects();
    //this.loadCenters();
    //this.loadDepartaments();
  }

  componentWillUnmount() {
    this.source.cancel('cancel request');
  }

  render() {
    return (
      <section>
        <h1 className='h3 mb-2 text-gray-800'>Lista de Proyectos</h1>

        {this.state.loading ? (
          <ReactTable
            columns={this.state.columns}
            defaultPageSize={5}
            NoDataComponent={NoDataConst}></ReactTable>
        ) : (
          <ReactTable
            columns={this.state.columns}
            data={this.state.projectsInfo}
            defaultPageSize={5}
            noDataText={'No existen Proyectos'}
            filterable></ReactTable>
        )}
        
        <AlertComponent
          alertId={this.state.alertId}
          alertVariant={this.state.alertVariant}
          alertMessage={this.state.alertMessage}
        />
      </section>
    );
  }
}

export default ListProjectsUser;
