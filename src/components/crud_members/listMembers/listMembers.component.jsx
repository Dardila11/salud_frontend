import React, { Component } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';
import { Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import matchSorter from 'match-sorter';
import ReactTable from 'react-table';
import Capitalize from 'react-capitalize';
import "./listMembers.styles.css";
/**
 * hallar mejor forma para colocar en mayuscula la primera letra
 */
import AlertComponent from '../../layout/alert/alert.component';
//import CreateMemberFormik from '../createMember/createMember.component';
//import UpdateMemberFormik from '../updateMember/updateMember.component';
import DeleteMember from '../deleteMember/deleteMember.component';
import AddMember from '../add_member/addMember.component';
import ViewMember from '../viewMember/viewMember.component';

import { getHeader, showAlert } from '../../utils/utils';
import { URL } from '../../utils/URLSever';

//import 'react-table/react-table.css';
//import './listMembers.styles.css';
/**
 * @function NoDataConst
 * @description se encarga de mostrar el spinner de carga
 */
const NoDataConst = () => (
  <Loader
    type='ThreeDots'
    color='#00BFFF'
    height={100}
    width={100}
    timeout={3000}
    className='mh -loading -active'
  />
);
class ListMembers extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();
  typeModal = 0;
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      info: [],
      usersinfo: [],
      idProjectMemberToEdit: '',
      membersInfo: [],
      infoCenters: [],
      infoDepartaments: [],
      memberInfo: [1],
      userPermissions: [],
      isVisibleCreate: false,
      isVisibleUpdate: false,
      isVisibleDelete: false,
      isVisibleView: false,
      alertVariant: '',
      alertMessage: '',
      alertId: 'alert-listUsers',
      columns: [
        {
          Header: 'Nombres',
          accessor: 'user_id__first_name',
          width: 150,
          maxWidth: 200,
          minWidth: 100,
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ['user_id__email'] }),
          filterAll: true
        },
        {
          Header: 'Apellidos',
          accessor: 'user_id__last_name',
          width: 150,
          maxWidth: 200,
          minWidth: 100,
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ['user_id__email'] }),
          filterAll: true,
          Cell: props => <Capitalize lowerRest>{props.value}</Capitalize>
        } /*,
          {
            Header: 'Permisos',
            accessor: 'permisos',
            width: 200,
            maxWidth: 200,
            minWidth: 100,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ['email'] }),
            filterAll: true,
            Cell: props => <Capitalize lowerRest>{props.value}</Capitalize>
          }*/,
        {
          id: 'role',
          Header: 'Rol',
          accessor: d => {
            switch (d.role) {
              case 1:
                return 'Gestor';
              case 2:
                return 'Investigador';
              case 3:
                return 'Tecnico';
            }
          },
          sortable: false,
          filterable: false,
          width: 150,
          maxWidth: 150,
          minWidth: 100
        },
        {
          Header: 'Activo',
          accessor: 'is_active',
          sortable: true,
          filterable: false,
          witdh: 70,
          minWidth: 70,

          Cell: props => {
            return props.value ? (
              <div className='success'></div>
            ) : (
              <div className='remove'></div>
            );
          }
        },
        {
          Header: 'Acciones',
          sortable: false,
          filterable: false,
          width: 250,
          maxWidth: 250,
          minWidth: 200,
          Cell: props => {
            return (
              <div>
                <OverlayTrigger
                  placement='right'
                  delay={{ show: 250, hide: 100 }}
                  overlay={<Tooltip>Detalles</Tooltip>}>
                  <Button
                    className='update'
                    variant='outline-primary'
                    onClick={() => {
                      this.updateRow(props.original.id);
                    }}></Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement='right'
                  delay={{ show: 250, hide: 100 }}
                  overlay={<Tooltip>Actualizar</Tooltip>}>
                  <Button
                    className='view'
                    variant='outline-primary'
                    onClick={() => {
                      this.viewRow(props.original.id);
                    }}></Button>
                </OverlayTrigger>

                <OverlayTrigger
                  placement='right'
                  delay={{ show: 250, hide: 100 }}
                  overlay={<Tooltip>Estado</Tooltip>}>
                  <Button
                    className='ml-1 change'
                    variant='outline-danger'
                    onClick={() => {
                      this.deleteRow(props.original.id);
                    }}></Button>
                </OverlayTrigger>
              </div>
            );
          }
        }
      ]
    };
  }
  componentDidMount() {
    console.log(this.props.project);
    this.getMembers();
    this.getUsers();
    
    
    
  }
  handleClose = () => {
    this.setState({
      isVisibleCreate: false,
      isVisibleUpdate: false,
      isVisibleDelete: false,
      isVisibleView: false
    });
  };

  handleCloseAddMember = () => {
    this.setState({ isVisibleCreate: false });
    this.getUsersInfo()
    this.getMembers()
    
  }

  handleOpenCreate = () => {
    this.setState({ isVisibleCreate: true });
  };
  handleOpenView = () => {
    console.log(this.state.memberInfo)
    this.setState({ isVisibleView: true });
  };
  handleOpenUpdate = () => {
    this.setState({ isVisibleUpdate: true });
  };
  handleOpenDelete = () => {
    this.setState({ isVisibleDelete: true });
    console.log(this.state.memberInfo);
  };
  handleCloseView = () => {
    this.getMembers();
    this.handleClose();
  };
  handleCloseUpdate = () => {
    this.getMembers();
    this.setState({
      alertVariant: 'success',
      alertMessage: 'Integrante Actualizado.'
    });
    this.handleClose();
    showAlert(this.state.alertId);
  };
  handleCloseDelete = () => {
    this.getMembers();
    this.setState({
      alertVariant: 'success',
      alertMessage: 'Estado del Integrante modificado.'
    });
    this.handleClose();
    showAlert(this.state.alertId);
  };

  getMembers = async () => {
    const headers = getHeader();
    axios
      .get(
        URL + '/studies/user/' + this.props.project,
        { headers: headers },
        { cancelToken: this.source.token }
      )
      .then(response => {
        this.setState({ membersInfo: response.data }, () => {
          this.getUsersInfo();
        });
      })
      .catch(error => {
        console.log('oh no, hubo un error!');
        console.log(error.status);
      });
  };
  getMembersInfo = () => {
    console.log(this.state.membersInfo);
  };
  getProjectMemberToEdit = async id => {
    const headers = getHeader();
    await axios
      .get(
        URL + '/studies/user/study/' + id + '/',
        { headers: headers },
        { cancelToken: this.source.token }
      )
      .then(response => {
        this.setState({ memberInfo: response.data }, () => {
          console.log(this.typeModal)
          if (this.typeModal==1) {
            this.handleOpenView();
          } else if (this.typeModal==2) {
            this.handleOpenUpdate();
          }
          else if (this.typeModal==3) {
            this.handleOpenDelete();
          }
        });
      });
  };
  viewRow = id => {
    this.typeModal = 1;
    this.setState({ idProjectMemberToEdit: id }, () => {
      this.getProjectMemberToEdit(this.state.idProjectMemberToEdit);
    });
  };
  updateRow = id => {
    this.typeModal = 2;
    this.setState({ idProjectMemberToEdit: id }, () => {
      this.getProjectMemberToEdit(this.state.idProjectMemberToEdit);
    });
  };
  deleteRow = id => {
    this.typeModal = 3;
    this.setState({ idProjectMemberToEdit: id }, () => {
      this.getProjectMemberToEdit(this.state.idProjectMemberToEdit);
    });
  };

  /**
   * @function getUsers
   * @description Realiza una peticion al servidor el cual obtiene todos los
   * usuarios que existen.
   */
  getUsers = async () => {
    const headers = getHeader();
    axios
      .get(
        URL + '/users/all/',
        { headers: headers },
        { cancelToken: this.source.token }
      )
      .then(response => {
        this.setState({ info: response.data }, () => {
         
        });
      })
      .catch(error => {
        console.log('oh no, hubo un error!');
        console.log(error.status);
      });
  };

  getUsersInfo = () => {
    var incluido =false
    var usersInfoArray = [];
    for (let i = 0; i < this.state.info.length; i++) {
      var email = this.state.info[i].email;
      var firstName = this.state.info[i].first_name;
      var lastName = this.state.info[i].last_name;
      var id = this.state.info[i].id;

      console.log(this.state.membersInfo.length)
      for (let j = 0; j < this.state.membersInfo.length; j++){
        
          if(this.state.info[i].id===this.state.membersInfo[j].user_id)
              incluido=true
      }
      
      if(incluido==false)
          usersInfoArray.push({
            userEmail: email,
            userName: firstName + ' ' + lastName,
            userId: id
          });
      incluido=false
    }
    this.setState({ usersInfo: usersInfoArray });
  };

  render() {
    return (
      <section>
        <h1 className='h3 mb-2 text-gray-800'>Lista de Integrantes</h1>
        <button
          className='btn btn-primary btn-icon-split p-0 mb-2'
          onClick={this.handleOpenCreate}>
          <span className='icon text-white-50'>
            <i className='fas fa-plus-square'></i>
          </span>
          <span className='text text-white'>Agregar Integrante</span>
        </button>
        {this.state.loading ? (
          <ReactTable
            columns={this.state.columns}
            defaultPageSize={5}
            NoDataComponent={NoDataConst}></ReactTable>
        ) : (
          <ReactTable
            columns={this.state.columns}
            data={this.state.membersInfo}
            defaultPageSize={5}
            noDataText={'No existen usuarios'}
            filterable></ReactTable>
        )}

        <Modal
          dialogClassName="modal-90w"
          show={this.state.isVisibleCreate}
          onHide={this.handleClose}>
          {/* Agregar Miembro */}
          <AddMember
            handleClose={this.handleClose}
            handleCloseAddMember={this.handleCloseAddMember}
            study_id={this.props.project}
            usersInfo={this.state.usersInfo}
          />
        </Modal>
        <Modal 
          show={this.state.isVisibleDelete} onHide={this.handleClose}>
          {/* Eliminar Usuario */}
          <DeleteMember
            handleCloseDelete={this.handleCloseDelete}
            handleClose={this.handleClose}
            id={this.state.idProjectMemberToEdit}
            is_active={this.state.memberInfo[0].is_active}
          />
        </Modal>
        <Modal 
          dialogClassName="modal-90w"
          show={this.state.isVisibleView} onHide={this.handleClose}>
          {/* Eliminar Usuario */}
          <ViewMember
            handleCloseView={this.handleCloseView}
            handleClose={this.handleClose}
            id={this.state.idProjectMemberToEdit}
            memberInfo={this.state.memberInfo[0]}
          />
        </Modal>
        <AlertComponent
          alertId={this.state.alertId}
          alertVariant={this.state.alertVariant}
          alertMessage={this.state.alertMessage}
        />
      </section>
    );
  }
}

export default ListMembers;
