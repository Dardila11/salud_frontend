import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

export default class AlertComponent extends Component {
  render() {
    return (
      <div id={this.props.alertId} className='container-alert back'>
        <Alert show={true} variant={this.props.alertVariant}>
          <p className='mb-0'>{this.props.alertMessage}</p>
        </Alert>
      </div>
    );
  }
}
