import React, { Component } from "react";
import axios from "axios";
import { Modal, Button, Alert } from "react-bootstrap";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { URL } from "../../utils/URLSever";
import CreateUser from "../createUser/createUser";
import UpdateUser from "../updateUser/updateUser";
import ViewUser from "../viewUser/viewUser";
import DeleteUser from "../deleteUser/deleteUser";
import "./listUsers.styles.css";

// TODO:
// - Arreglar el ancho de la tabla
// - Que solo sea una columna para el Rol

class ListUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailToEdit: "",
      allInfo: [],
      info: [],
      infoUsers: [],
      show: false,
      showCreate: false,
      showUpdate: false,
      showView: false,
      showDelete: false,
      showAlert: false,
      showMessage: false,
      message: false
    };
  }

  handleCloseCreate = () => {
    // mostrar mensaje usuario creado
    this.setState({ showMessage: true, message: "Usuario Creado" });
    this.handleClose();
  };

  handleCloseView = () => {
    // mostrar mensaje usuario creado
    this.handleClose();
  };
  handleCloseUpdate = () => {
    // mostrar mensaje usuario creado
    this.setState({ showMessage: true, message: "Usuario Actualizado" });
    this.handleClose();
  };
  handleCloseDelete = () => {
    // mostrar mensaje usuario creado
    this.handleClose();
  };

  handleClose = () => {
    this.setState(
      {
        showAlert: false,
        showCreate: false,
        showUpdate: false,
        showDelete: false,
        showView: false
      },
      () => {
        console.log("se actualizan los usuarios nuevamente");
        this.getUsers();
      }
    );
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  handleCreate = () => {
    this.setState({ showCreate: true });
  };

  handleUpdate = email => {
    this.setState({ showUpdate: true });
  };

  handleView = email => {
    this.setState({ showView: true });
  };

  handleDelete = event => {
    // este solo confirma al usuario la accion que se llevará a cabo
    this.setState({ showDelete: true });
  };

  getUsers = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    axios
      .get(URL + "/users/all/", {
        headers: {
          Authorization: "JWT " + token
        }
      })
      .then(response => {
        //console.log(response.data["2"].fields.first_name);
        console.log(response.data);
        this.setState({ info: response.data }, () => {
          console.log("Todos los usuarios: " + this.state.info["2"].is_simple);
          for (let index = 0; index < this.state.info.length; index++) {
            console.log(this.state.info[index]);
          }
        });
      });
  };
  componentDidMount() {
    this.getUsers();
  }

  updateRow = email => {
    this.setState({ emailToEdit: email });
    this.handleUpdate(email);
  };

  viewRow = email => {
    this.setState({ emailToEdit: email }, () => {
      console.log("viewRow: " + this.state.emailToEdit);
      this.handleView(email);
    });
  };

  deleteRow = email => {
    this.setState({ emailToEdit: email });
    this.handleDelete(email);
  };

  render() {
    const handleDismiss = () => this.setState({ showMessage: false });
    const columns = [
      {
        Header: "Nombres",
        accessor: "first_name",
        width: 150,
        maxWidth: 200,
        minWidth: 100
      },
      {
        Header: "Apellidos",
        accessor: "last_name",
        width: 150,
        maxWidth: 200,
        minWidth: 100
      },
      {
        Header: "Email",
        accessor: "email",
        width: 200,
        maxWidth: 200,
        minWidth: 100
      },
      {
        Header: "Centro",
        accessor: "my_center__name",
        sortable: false,
        filterable: false,
        width: 100,
        maxWidth: 100,
        minWidth: 100
      },
      {
        Header: "Departamentos",
        accessor: "my_department__name",
        sortable: false,
        filterable: false,
        width: 150,
        maxWidth: 150,
        minWidth: 100
      },
      {
        id: "is_simple",
        Header: "Rol",
        accessor: d => {
          return d.is_simple ? "Usuario" : "Administrador";
        },
        sortable: false,
        filterable: false,
        width: 150,
        maxWidth: 150,
        minWidth: 100
      },
      {
        id: "is_active",
        Header: "Activo",
        accessor: d => {
          return d.is_active ? "Si" : "No";
        },
        sortable: false,
        filterable: false,
        width: 150,
        maxWidth: 150,
        minWidth: 100
      },
      {
        Header: "Acciones",
        sortable: false,
        filterable: false,
        width: 250,
        maxWidth: 250,
        minWidth: 200,
        Cell: props => {
          return (
            <>
              <Button
                onClick={() => {
                  this.updateRow(props.original.email);
                }}>
                Editar
              </Button>
              <Button
                className="ml-1"
                onClick={() => {
                  console.log(props.original.email);
                  this.viewRow(props.original.email);
                }}>
                Ver
              </Button>
              <Button
                className="ml-1"
                onClick={() => {
                  this.deleteRow(props.original.email);
                }}>
                Eliminar
              </Button>
            </>
          );
        }
      }
    ];
    return (
      <>
        <h1>Esto es una tabla para listar los usuarios</h1>
        <Button className="mb-2" onClick={this.handleCreate}>
          Crear usuario
        </Button>
        <ReactTable
          columns={columns}
          data={this.state.info}
          defaultPageSize={6}
          noDataText={"No existen usuarios"}
          filterable></ReactTable>

        <Modal show={this.state.showCreate} onHide={this.handleClose}>
          {/* Crear Usuario */}
          <CreateUser
            handleCloseCreate={this.handleCloseCreate}
            handleClose={this.handleClose}
          />
        </Modal>
        <Modal show={this.state.showUpdate} onHide={this.handleClose}>
          {/* Actualizar Usuario */}
          <UpdateUser
            handleCloseUpdate={this.handleCloseUpdate}
            handleClose={this.handleClose}
            email={this.state.emailToEdit}
          />
        </Modal>
        <Modal show={this.state.showView} onHide={this.handleClose}>
          {/* Ver Usuario */}
          <ViewUser
            handleCloseView={this.handleCloseView}
            handleClose={this.handleClose}
            email={this.state.emailToEdit}
          />
        </Modal>
        <Modal show={this.state.showDelete} onHide={this.handleClose}>
          {/* Eliminar Usuario */}
          <DeleteUser
            handleCloseDelete={this.handleCloseDelete}
            handleClose={this.handleClose}
            email={this.state.emailToEdit}
          />
        </Modal>
        <div className="no-login time">
          <Alert
            variant="success"
            show={this.state.showMessage}
            onClose={handleDismiss}
            dismissible>
            <p className="mb-0">{this.state.message}</p>
          </Alert>
        </div>
      </>
    );
  }
}

export default ListUsers;
