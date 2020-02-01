import React, { Component } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';
import { Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import matchSorter from 'match-sorter';
import ReactTable from 'react-table';
import Capitalize from 'react-capitalize';
/**
 * hallar mejor forma para colocar en mayuscula la primera letra
 */
import AlertComponent from '../../layout/alert/alert.component';
//import CreateMemberFormik from '../createMember/createMember.component';
//import UpdateMemberFormik from '../updateMember/updateMember.component';
//import DeleteMember from '../deleteMember/deleteMember.component';

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
    constructor(props) {
      super(props);
      this.state = {
        loading: false,
        emailToRead: '',
        membersinfo: [],
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
            Header: 'Nombres',
            accessor: 'user_id__email',
            width: 150,
            maxWidth: 200,
            minWidth: 100,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ['user_id__email'] }),
            filterAll: true,
          }
          ,
          {
            Header: 'Apellidos',
            accessor: 'user_id__email',
            width: 150,
            maxWidth: 200,
            minWidth: 100,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ['user_id__email'] }),
            filterAll: true,
            Cell: props => <Capitalize lowerRest>{props.value}</Capitalize>
          }/*,
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
          }/*,
          {
            Header: 'Activo',
            accessor: 'is_active',
            sortable: true,
            filterable: false,
            width: 50,
            maxWidth: 50,
            minWidth: 50,
            Cell: props => {
              return props.value ? (
                <div className='success'></div>
              ) : (
                <div className='remove'></div>
              );
            }
          }*/,
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
                    overlay={<Tooltip>Actualizar</Tooltip>}>
                    <Button
                      className='update'
                      variant='outline-primary'
                      onClick={() => {
                        this.updateRow(props.original.email);
                      }}></Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement='right'
                    delay={{ show: 250, hide: 100 }}
                    overlay={<Tooltip>Detalles</Tooltip>}>
                    <Link
                      className='ml-1 view btn btn-outline-primary'
                      variant='outline-primary'
                      role='button'
                      to={'/admin/users/' + props.original.email}
                    />
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement='right'
                    delay={{ show: 250, hide: 100 }}
                    overlay={<Tooltip>Estado</Tooltip>}>
                    <Button
                      className='ml-1 change'
                      variant='outline-danger'
                      onClick={() => {
                        this.deleteRow(props.original.email);
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
      this.getMembers();
    }
  
    getMembers = async () => {
      const headers = getHeader();
      axios
        .get(
          URL + '/studies/user/1',
          { headers: headers },
          { cancelToken: this.source.token }
        )
        .then(response => {
          this.setState({ membersInfo: response.data }, () => {
            this.getMembersInfo();
          });
        })
        .catch(error => {
          console.log('oh no, hubo un error!');
          console.log(error.status);
        });
    };
    getMembersInfo = () => {

     
      console.log(this.state.membersInfo)
      
      
    };
    render() {
      return (
        <section>
          <h1 className='h3 mb-2 text-gray-800'>Lista de Miembros</h1>
          <button
            className='btn btn-primary btn-icon-split p-0 mb-2'
            onClick={this.handleOpenCreate}>
            <span className='icon text-white-50'>
              <i className='fas fa-plus-square'></i>
            </span>
            <span className='text text-white'>Agregar Miembro</span>
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
          
        </section>
      );
    }

  }
  
  export default ListMembers;