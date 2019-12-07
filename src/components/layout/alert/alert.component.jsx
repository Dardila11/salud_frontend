import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

export default class AlertComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='container-alert'>
        <Alert show={true} variant={this.props.alertVariant}>
          <p className='mb-0'>{this.props.alertMessage}</p>
        </Alert>
      </div>
    );
  }
}
