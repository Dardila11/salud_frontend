  import React, { Component } from 'react';
import axios from 'axios';

import { Col, ListGroup, Row } from 'react-bootstrap';
import { getHeader } from '../../utils/utils';
import { URL } from '../../utils/URLSever';
import Loader from 'react-loader-spinner';

import { getDateFormat } from '../../utils/utils';

export default class ViewProject extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      studyInfo: [],
      isAdmin: true
    };
  }

  getStudyById = id => {
    const headers = getHeader();
    this.setState({ loading: true }, () =>
      axios
        .get(
          URL + '/studies/' + id,
          { headers: headers },
          { cancelToken: this.source.token }
        )
        .then(response => {
          this.setState({
            studyInfo: response.data,
            loading: false
          });
        })
        .catch(() => this.setState({ loading: false }))
    );
  };

  componentDidMount() {
    this.getStudyById(this.props.project);
  }

  render() {
    const { studyInfo } = this.state;
    return (
      <>
        {this.state.loading ? (
          <Loader
            type='ThreeDots'
            height={100}
            width={100}
            color='#00BFFF'
            timeout={3000}
            className='mh'
          />
        ) : studyInfo.length > 0 ? (
          <ListGroup>
            <ListGroup.Item variant='dark'>
              <h5 className='mb-0' style={{ textTransform: 'capitalize' }}>
                {studyInfo[0].fields.title_little}
              </h5>
            </ListGroup.Item>
            <ListGroup.Item>
              Código: {studyInfo[0].fields.study_id}
            </ListGroup.Item>
            <ListGroup.Item>
              Fecha de registro: {getDateFormat(studyInfo[0].fields.date_reg)}
            </ListGroup.Item>
          </ListGroup>
        ) : (
          <h4>El proyecto no existe</h4>
        )}
      </>
    );
  }
}
