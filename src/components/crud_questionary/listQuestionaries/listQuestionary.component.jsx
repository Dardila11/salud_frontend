import React, { Component } from 'react';
import axios from 'axios';

import AlertComponent from '../../layout/alert/alert.component';
import { Link } from 'react-router-dom';
import { Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import matchSorter from 'match-sorter';
import ReactTable from 'react-table';
import CreateQuestionary from '../createQuestionary/createQuestionary.component';

import { getHeader, showAlert } from '../../utils/utils';
import { URL } from '../../utils/URLSever';

const NoDataConst = () => (
  <Loader
    type='ThreeDots'
    height={100}
    width={100}
    color='#00BFFF'
    timeout={3000}
    className='mh -loading -active'
  />
);

class ListQuestionaries extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      listQuestionaries: [],
      isVisibleCreate: false,
      alertVariant: '',
      alertMessage: '',
      alertId: 'alert-listProjects',
      columns: [
        {
          Header: 'Código',
          accessor: 'code',
          width: 150,
          maxWidth: 200,
          minWidth: 100,
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ['code'] }),
          filterAll: true
        },
        {
          Header: 'Título',
          accessor: 'title',
          width: 200,
          maxWidth: 250,
          minWidth: 200,
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ['title'] }),
          filterAll: true,
          Cell: props => props.value
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
                  overlay={<Tooltip>Actualizar</Tooltip>}>
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
                  overlay={<Tooltip>Detalles</Tooltip>}>
                  <Link
                    className='ml-1 view btn btn-outline-primary'
                    variant='outline-primary'
                    role='button'
                    to={'/admin/questionary/' + props.original.id}
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

  handleOpenCreate = () => {
    this.setState({ isVisibleCreate: true });
  };

  handleClose = () => {
    this.setState({
      isVisibleCreate: false
    });
  };

  handleCloseCreate = () => {
    this.getQuestionaries();
    this.setState({
      alertVariant: 'success',
      alertMessage: 'Cuestionario creado.'
    });
    this.handleClose();
    showAlert(this.state.alertId);
  };

  getQuestionaries = () => {
    const headers = getHeader();
    this.setState({ loading: true }, () =>
      axios
        .get(
          URL + '/questionaries/' + this.props.study,
          { headers: headers },
          { cancelToken: this.source.token }
        )
        .then(response => {
          this.setState({ listQuestionaries: response.data, loading: false });
        })
        .catch(error => {
          this.setState({ loading: false });
        })
    );
  };

  renderQuestionaries = () => {
    const table = (
      <ReactTable
        columns={this.state.columns}
        data={this.state.listQuestionaries}
        defaultPageSize={5}
        noDataText={'No existen cuestionarios'}
        filterable
        previousText='Atras'
        nextText='Siguiente'
        pageText='Página'
        ofText='de'
        rowsText='filas'
      />
    );
    return table;
  };

  componentDidMount() {
    this.getQuestionaries();
  }

  render() {
    return (
      <section>
        <h1 className='h3 mb-2 text-gray-800'>Lista de cuestionarios</h1>
        <button
          className='btn btn-primary btn-icon-split p-0 mb-2'
          onClick={this.handleOpenCreate}>
          <span className='icon text-white-50'>
            <i className='fas fa-plus-square'></i>
          </span>
          <span className='text text-white'>Agregar cuestionario</span>
        </button>
        {this.state.loading ? (
          <ReactTable
            columns={this.state.columns}
            defaultPageSize={5}
            NoDataComponent={NoDataConst}
          />
        ) : (
          <this.renderQuestionaries />
        )}
        <Modal
          size='lg'
          show={this.state.isVisibleCreate}
          onHide={this.handleClose}>
          {/* Crear Proyecto */}
          <CreateQuestionary
            study={this.props.study}
            handleCloseCreate={this.handleCloseCreate}
            handleClose={this.handleClose}
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

export default ListQuestionaries;
