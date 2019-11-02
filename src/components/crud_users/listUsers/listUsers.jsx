import React, { Component } from "react";
import axios from "axios";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { URL } from "../../utils/URLSever";
import { cloneNode } from "@babel/types";

// TODO
// - Obtener todos los usuarios del api /users/all/
// - listarlos apropiadamente en la tabla

class ListUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: [],
      infoUsers: []
    };
  }

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
        var data_array = [];
        this.setState({ info: response.data }, () => {
          console.log(this.state.info);
          for (let index = 0; index < this.state.info.length; index++) {
            console.log(this.state.info[index].fields.first_name);
            data_array.push(this.state.info[index].fields);
          }
        });
        console.log(data_array[0]);
        this.setState({ infoUsers: data_array }, () => {
          console.log(this.state.infoUsers);
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
        accessor: "my_center",
        sortable: false,
        filterable: false
      },
      {
        Header: "Departamentos",
        accessor: "my_department",
        sortable: false,
        filterable: false
      },
      {
        Header: "Acciones",
        sortable: false,
        filterable: false,
        width: 100,
        maxWidth: 100,
        minWidth: 100,
        Cell: props => {
          return (
            <button
              onClick={() => {
                this.deleteRow(props.original.id);
              }}>
              Editar
            </button>
          );
        }
      }
    ];
    return (
      <>
        <h1>Esto es una tabla para listar los usuarios</h1>
        <ReactTable
          columns={columns}
          data={this.state.infoUsers}
          defaultPageSize={10}
          noDataText={"No existen usuarios"}
          filterable></ReactTable>
      </>
    );
  }
}

export default ListUsers;
