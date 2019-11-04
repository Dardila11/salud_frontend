import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

class DeleteUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailToEdit: props.email,
      setShow: false
    };
  }
  handleClose = () => {
    this.props.handleClose();
  };

  handleClose = () => {
    this.setState({ setShow: false });
  };

  handleCloseDelete = () => {
    this.props.handleCloseDelete();
  };
  render() {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Modal body text goes here.</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary">Close</Button>
          <Button variant="primary">Save changes</Button>
        </Modal.Footer>
      </>
    );
  }
}

export default DeleteUser;
