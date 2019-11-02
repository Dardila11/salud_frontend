import React, { Component } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { URL } from "../../utils/URLSever";
import CreateUser from "../createUser/createUser";

// TODO
// - Arreglar los Modals (mostrarlos y cerrarlos)
// - agregar codigo para que funcionen todo los Modals (Create, View, Delete, etc)

class ListUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: [],
      infoUsers: [],
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
          console.log(this.state.info);
        });
      });
  };
  componentDidMount() {
    this.getUsers();
  }

  /*deleteRow = id => {
    const index = this.state.posts.findIndex(post => {
      return post.id === id;
    });
    console.log(index);
  };*/

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
        width: 100,
        maxWidth: 100,
        minWidth: 100
        /*Cell: props => {
          return (
            <button
              onClick={() => {
                this.deleteRow(props.original.id);
              }}>
              Editar
            </button>
          );
        }*/
      }
    ];
    return (
      <>
        <h1>Esto es una tabla para listar los usuarios</h1>
        <button onClick={this.handleShow}>Crear usuario</button>
        <ReactTable
          columns={columns}
          data={this.state.info}
          defaultPageSize={10}
          noDataText={"No existen usuarios"}
          filterable></ReactTable>

        <Modal show={this.state.setShow} onHide={this.handleClose}>
          {/* Crear Usuario */}
          <CreateUser />
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ListUsers;
