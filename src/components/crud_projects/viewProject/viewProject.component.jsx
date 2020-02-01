import React, { Component } from "react";
import axios from "axios";

import { Col, ListGroup, Row, Tab, Button } from "react-bootstrap";
import { getHeader } from "../../utils/utils";
import { URL } from "../../utils/URLSever";
import Loader from "react-loader-spinner";
import "./viewProject.styles.css";

import { getDateFormat } from "../../utils/utils";

export default class ViewProject extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      studyInfo: [],
      isAdmin: true
    };
  }

  getStudyById = id => {
    const headers = getHeader();
    this.setState({ loading: true }, () =>
      axios
        .get(
          URL + "/studies/" + id,
          { headers: headers },
          { cancelToken: this.source.token }
        )
        .then(response => {
          this.setState({
            studyInfo: response.data,
            loading: false
          });
        })
        .catch(() => this.setState({ loading: false }))
    );
  };

  componentDidMount() {
    this.getStudyById(this.props.project);
  }

  render() {
    const { studyInfo } = this.state;
    return (
      <>
        {this.state.loading ? (
          <Loader
            type="ThreeDots"
            height={100}
            width={100}
            color="#00BFFF"
            timeout={3000}
            className="mh"
          />
        ) : studyInfo.length > 0 ? (
          <Tab.Container defaultActiveKey="#general">
            <Row>
              <Row sm={4}>
                <ListGroup horizontal>
                  <ListGroup.Item action href="#general">
                    General
                  </ListGroup.Item>
                  <ListGroup.Item action href="#design">
                    Diseño
                  </ListGroup.Item>
                </ListGroup>
              </Row>
            </Row>
            <Row>
              <Row sm={8}>
                <Tab.Content>
                  <Tab.Pane eventKey="#general">
                    <div className="clearfix"></div>
                    <div className="viewContainer">
                      <h5 style={{ textTransform: "capitalize" }}>
                        Información General del proyecto
                      </h5>
                      <div className="clearfix"></div>
                      <div className="wideContainer">
                        <div className="halfWidthContainer">
                          <h6>Detalles:</h6>
                          <span>
                            Nombre: {studyInfo[0].fields.title_little}
                          </span>
                          <span>Código: {studyInfo[0].fields.study_id}</span>
                          <span>Código: {studyInfo[0].fields.study_id}</span>
                          <span>
                            Fecha de registro:{" "}
                            {getDateFormat(studyInfo[0].fields.date_reg)}
                          </span>

                          <Button action href="#">
                            Add
                          </Button>
                        </div>
                        <div className="halfWidthContainer">
                          <h6>Componentes:</h6>
                          <Button action href="#">
                            Integrantes
                            <span>[2]</span>
                          </Button>
                          <Button action href="#">
                            Centros
                            <span>[5]</span>
                          </Button>
                        </div>
                      </div>
                      <div className="clearfix"></div>
                      <div className="wideContainer">
                        <h6>Estado:</h6>
                        <span>Registro</span>
                        <span>Diseño</span>
                      </div>
                      <div className="clearfix"></div>
                    </div>
                    <div className="clearfix"></div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="#design">
                    <div className="viewContainer">
                      Este contenido no se encuentra disponible
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Row>
            </Row>
          </Tab.Container>
        ) : (
          <h4>El proyecto no existe</h4>
        )}
      </>
    );
  }
}
