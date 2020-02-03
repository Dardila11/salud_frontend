import React, { Component } from "react";
import axios from "axios";

import { Col, ListGroup, Row, Tab, Button, Modal } from "react-bootstrap";
import { getHeader } from "../../utils/utils";
import { URL } from "../../utils/URLSever";
import Loader from "react-loader-spinner";

import UpdateProjectFormik from "../updateProject/updateProject.component";
import "./viewProject.styles.css";
import AlertComponent from "../../layout/alert/alert.component";

import { getDateFormat } from "../../utils/utils";

export default class ViewProject extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();
  typeModal = 0;

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      studyInfo: [],
      isAdmin: true,
      idProjectToEdit: -1,
      projectInfo: [1],
      info: [],
      projectsInfo: [],
      usersInfo: [],
      isVisibleCreate: false,
      isVisibleUpdate: false,
      isVisibleDelete: false,
      showMessage: false,
      message: false,
      alertVariant: "",
      alertMessage: "",
      alertId: "alert-listProjects"
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

  handleOpenUpdate = () => {
    this.setState({ isVisibleUpdate: true });
  };

  /**
   * @function handleCloseUpdate function enviada como prop de un componente.
   * es llamada cuando un usuario es actualizado satisfactoriamente
   */
  handleCloseUpdate = () => {
    this.getProjects();
    this.setState({
      alertVariant: "success",
      alertMessage: "Proyecto Actualizado."
    });
    this.handleClose();
    /*showAlert(this.state.alertId);*/
  };

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
                        <div className="halfWidthContainer padding">
                          <h6>Detalles:</h6>
                          <span className="wideContainer">
                            Nombre: {studyInfo[0].fields.title_little}
                          </span>
                          <span className="wideContainer">
                            Código: {studyInfo[0].fields.study_id}
                          </span>
                          <span className="wideContainer">
                            Código: {studyInfo[0].fields.study_id}
                          </span>
                          <span className="wideContainer">
                            Fecha de registro:{" "}
                            {getDateFormat(studyInfo[0].fields.date_reg)}
                          </span>
                          <Modal
                            size="lg"
                            show={this.state.isVisibleUpdate}
                            onHide={this.handleClose}
                          >
                            {/* Actualizar Proyecto */}
                            <UpdateProjectFormik
                              handleCloseUpdate={this.handleCloseUpdate}
                              handleClose={this.handleClose}
                              usersInfo={this.state.usersInfo}
                              projectInfo={this.state.projectInfo}
                            />
                          </Modal>
                          <Button
                            action
                            href="#"
                            className="update"
                            variant="outline-primary"
                            /*onClick={() => {
                              this.updateRow(props.original.id_pk);*/
                          />
                        </div>
                        <div className="halfWidthContainer padding">
                          <h6>Componentes:</h6>
                          <div className="clearfix"></div>
                          <a action href="#" className="btIntegrantes">
                            Integrantes
                            <br />
                            <span>[2]</span>
                          </a>
                          <div className="clearfix"></div>
                          <a action href="#" className="btCentros">
                            Centros
                            <br />
                            <span>[5]</span>
                          </a>
                        </div>
                      </div>
                      <div className="clearfix"></div>
                      <div className="wideContainer state padding">
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
        <AlertComponent
          alertId={this.state.alertId}
          alertVariant={this.state.alertVariant}
          alertMessage={this.state.alertMessage}
        />
      </>
    );
  }
}
