import React, { Component } from "react";
import { Modal } from "react-bootstrap";

// TODO
// - Arreglar las accioens de mostrar y esconder del modal apropiadamente. los botones deben ir en este archivo
// - Agregar el formulario para crear nuevos usuarios
// - Implementar la peticion al API para crear nuevos usuarios
class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      setShow: false
    };
  }
  handleClose = () => {
    this.setState({ setShow: false });
  };

  handleShow = () => {
    this.setState({ setShow: true });
  };
  render() {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Crear Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1>Modal para crear usuarios</h1>
        </Modal.Body>
      </>
    );
  }
}

export default CreateUser;
