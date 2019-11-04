import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

class DeleteUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailToEdit: props.email,
      setShow: false,
      show: false
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
          <Modal.Title>Eliminar Usuario</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Modal body text goes here.</p>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.handleCloseDelete} variant="secondary">
            Cancelar
          </Button>
          <Button onClick={this.handleCloseDelete} variant="danger">
            Eliminar
          </Button>
        </Modal.Footer>
      </>
    );
  }
}

export default DeleteUser;
