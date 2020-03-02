import React, { Component } from 'react';
import axios from 'axios';

import { InputGroup, Button } from 'react-bootstrap';
import { URL } from '../../utils/URLSever';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import matchSorter from 'match-sorter';
import * as Utils from '../../utils/utils';

import './addCenter.style.css';

class AddCenter extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      center: null,
      listCenters: []
    };
  }

  addCenter = () => {
    this.props.addCenter(this.state.center.pk);
  };

  getCenters = () => {
    const headers = Utils.getHeader();
    axios
      .get(
        URL + '/places/center/all',
        { headers: headers },
        { cancelToken: this.source.token }
      )
      .then(response => {
        console.log(response.data);
        this.setState({ listCenters: response.data });
      });
  };

  renderAutocomplete = () => {
    return (
      <Autocomplete
        id='combo-box-demo'
        className='custom-autocomplete'
        options={this.state.listCenters}
        getOptionLabel={option =>
          typeof option === 'string' ? option : option.name
        }
        style={{ width: 300 }}
        renderOption={option => (
          <React.Fragment>
            <div>
              <span>{option.name}</span>
              <hr />
            </div>
          </React.Fragment>
        )}
        value={this.state.center}
        name='center'
        onChange={(e, value) => {
          this.setState({ center: value });
        }}
        filterOptions={(options, { inputValue }) =>
          matchSorter(options, inputValue, {
            keys: ['name']
          })
        }
        renderInput={params => (
          <TextField {...params} name='center' variant='outlined' fullWidth />
        )}
      />
    );
  };

  componentDidMount() {
    this.getCenters();
  }

  render() {
    return (
      <InputGroup className='mb-3'>
        <this.renderAutocomplete />
        <InputGroup.Append>
          <Button variant='primary' onClick={this.addCenter}>
            Agregar
          </Button>
        </InputGroup.Append>
      </InputGroup>
    );
  }
}

export default AddCenter;
