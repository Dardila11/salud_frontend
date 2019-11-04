import React, { Component } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { URL } from "../../utils/URLSever";
import CreateUser from "../createUser/createUser";
import UpdateUser from "../updateUser/updateUser";
import ViewUser from "../viewUser/viewUser";
import DeleteUser from "../deleteUser/deleteUser";

// TODO
// - Arreglar los Modals (mostrarlos y cerrarlos)
// - Arreglar que se está mostrando usuarios duplicados por los permisos
// - agregar codigo para que funcionen todo los Modals (Create, View, Delete, etc)

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
      showAlert: false
    };
  }

  handleCloseCreate = () => {
    // mostrar mensaje usuario creado
    this.handleClose();
  };

  handleClose = () => {
    this.setState({ showCreate: false });
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

  getUsers = () => {
    var token = localStorage.getItem("token").replace(/[""]+/g, "");
    axios
      .get(URL + "/users/all/", {
        headers: {
          Authorization: "JWT " + token
        }
      })
      .then(response => {
        //console.log(response.data["2"].fields.first_name);
        //console.table(response.data);
        this.setState({ info: response.data }, () => {
          //this.getU(this.state.Allinfo);
          //this.setState({ info: this.state.Allinfo });
        });
      });
  };

  getU = info => {
    var unique = info.filter((elem, index, self) => {
      return index === self.indexOf(elem);
    });
    /*for (let index = 0; index < info.length; index++) {
      console.log(info[index].email);
      if (index + 1 !== info.length) {
        if (info[index + 1].email === info[index].email) {
          info.splice(index, 1);
        }
      }
    }*/
    console.log(unique);
  };
  componentDidMount() {
    this.getUsers();
  }

  updateRow = email => {
    /*const index = this.state.info.findIndex(info => {
      console.log(info.email);
      return info.email === email;
    });
    console.log(index);*/
    this.setState({ emailToEdit: email });
    this.handleUpdate(email);
  };

  viewRow = email => {
    this.setState({ emailToEdit: email });
    this.handleView(email);
  };

  deleteRow = email => {
    this.setState({ emailToEdit: email });
    this.handleDelete(email);
  };

  render() {
    const columns = [
      {
        Header: "Nombres",
        accessor: "first_name",
        width: 200,
        maxWidth: 200,
        minWidth: 100
      },
      {
        Header: "Apellidos",
        accessor: "last_name",
        width: 200,
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
        filterable: false
      },
      {
        Header: "Departamentos",
        accessor: "my_department__name",
        sortable: false,
        filterable: false
      },
      {
        Header: "Acciones",
        sortable: false,
        filterable: false,
        width: 200,
        maxWidth: 200,
        minWidth: 200,
        Cell: props => {
          //return <button onClick={this.handleUpdate}>Editar</button>;
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
        <Button onClick={this.handleCreate}>Crear usuario</Button>
        <ReactTable
          columns={columns}
          data={this.state.info}
          defaultPageSize={10}
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
          <UpdateUser email={this.state.emailToEdit} />
        </Modal>
        <Modal show={this.state.showView} onHide={this.handleClose}>
          {/* Ver Usuario */}
          <ViewUser email={this.state.emailToEdit} />
        </Modal>
        <Modal show={this.state.showDelete} onHide={this.handleClose}>
          {/* Eliminar Usuario */}

          <DeleteUser email={this.state.emailToEdit} />
        </Modal>
      </>
    );
  }
}

export default ListUsers;
