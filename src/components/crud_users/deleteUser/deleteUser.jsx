import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { URL } from "../../utils/URLSever";
import axios from "axios";

// TODO:
// - Agregar mensaje de configuracion para eliminar el usuario
// - Implementar la logica de la peticion para eliminar el usuario
class DeleteUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailToDelete: props.email,
      is_active: -1,
      setShow: false,
      show: false
    };
  }
  handleClose = () => {
    this.props.handleClose();
  };

  handleDelete = () => {
    var token = localStorage.getItem("token").replace(/[""]+/g, "");
    const { isActive } = this.state;
    var json = {
      email_instance: this.state.emailToDelete,
      is_active: 0
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "JWT " + token
    };
    axios
      .put(URL + "/users/active/", json, {
        headers: headers
      })
      .then(response => {
        console.log(response.data);
      });
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
          <Button onClick={this.handleDelete} variant="danger">
            Eliminar
          </Button>
        </Modal.Footer>
      </>
    );
  }
}

export default DeleteUser;
