import React, { Component } from 'react';
import axios from 'axios';

import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import ReactTable from 'react-table';
import matchSorter from 'match-sorter';

import { getHeader, showAlert } from '../../utils/utils';
import { URL } from '../../utils/URLSever';
import AlertComponent from '../../layout/alert/alert.component';
import AddCenter from '../addCenter/addCenter.component';

import 'react-table/react-table.css';

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

class ListCenters extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      listCenters: [],
      alertMessage: '',
      alertVariant: '',
      alertId: 'alert-list-centers',
      columns: [
        {
          Header: 'Id',
          accessor: 'center_id',
          width: 75,
          maxWidth: 100,
          minWidth: 75,
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ['center_id'] }),
          filterAll: true
        },
        {
          Header: 'Nombre',
          accessor: 'center_id__name',
          width: 200,
          maxWidth: 250,
          minWidth: 200,
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ['center_id__name'] }),
          filterAll: true,
          Cell: props => <span className="cap">{props.value}</span>
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

  addCenter = value => {
    const headers = getHeader();
    const data = {
      study: {
        study_id: this.props.project,
        center_id: value
      }
    };
    axios
      .post(URL + '/studies/center/', data, {
        headers: headers
      })
      .then(() => {
        this.setState({ progress: false }, () => this.getCenters());
        this.setState({
          progress: false,
          alertVariant: 'success',
          alertMessage: 'Se agrego el centro.'
        });
        showAlert(this.state.alertId);
      })
      .catch(error => {
        this.setState({
          progress: false,
          alertVariant: 'danger',
          alertMessage: 'No se agrego el centro.'
        });
        showAlert(this.state.alertId);
      });
  };

  getCenters = () => {
    const headers = getHeader();
    this.setState({ loading: true }, () =>
      axios
        .get(
          URL + '/studies/center/' + this.props.project,
          { headers: headers },
          { cancelToken: this.source.token }
        )
        .then(response => {
          this.setState({ listCenters: response.data, loading: false });
        })
        .catch(error => {
          this.setState({ loading: false });
        })
    );
  };

  renderCenters = () => {
    const table = (
      <ReactTable
        columns={this.state.columns}
        data={this.state.listCenters}
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
    this.getCenters();
  }

  render() {
    return (
      <section>
        <h1 className='h3 mb-2 text-gray-800'>Lista de centros</h1>
        <AddCenter addCenter={this.addCenter} />
        {this.state.loading ? (
          <ReactTable
            columns={this.state.columns}
            defaultPageSize={5}
            NoDataComponent={NoDataConst}
            previousText='Atras'
            nextText='Siguiente'
            pageText='Página'
            ofText='de'
            rowsText='filas'
          />
        ) : (
          <this.renderCenters />
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

export default ListCenters;
