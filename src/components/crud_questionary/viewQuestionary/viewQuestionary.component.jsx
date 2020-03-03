import React, { Component } from 'react';
import axios from 'axios';
import Draggable, { DraggableCore } from 'react-draggable';
import { getHeader } from '../../utils/utils';
import { URL } from '../../utils/URLSever';

import {
  Accordion,
  Card,
  Container,
  Button,
  Row,
  Col,
  Tab,
  Tabs
} from 'react-bootstrap';

import './viewQuestionary.styles.css';

class ViewQuestionary extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      listPages: [],
      listSections: [],
      listPageNews: [],
      listSectionsNews: [],
      listRefsSections: []
    };
  }
  newSection = () => {
    var arreglo = this.state.sections;
    const data = {
      id: 10,
      name: 'Sección 4',
      pos_y: 3,
      page_id_id: 2
    };
    this.state.listSectionsNews.push(data);
    this.state.listSections.push(data);

    //  this.listSections;
    // var ele=React.createElement(Row,
    //     {
    //         className :'Section',
    //         key:'S'
    //     }
    //     ,
    //         [React.createElement(Col, {className:'C-Section-Col',key:'Col1'+''+''}),React.createElement(Col, {className:'C-Section-Col',key:'Col2'+''}),React.createElement(Col, {className:'C-Section-Col',key:'Col3'+''}),React.createElement(Col, {})]
    //     )
    //     arreglo.push(ele)
    //     this.setState(prevState => ({
    //         sections:arreglo,
    //         width_Container:this.refContainer.current.getBoundingClientRect().width,
    //         height_Container:this.refContainer.current.getBoundingClientRect().height
    //       }))
    //       //console.log(this.refContainer.current.getBoundingClientRect())
    //       alert('alerta')
  };

  getPages = () => {
    const headers = getHeader();
    this.setState({ loading: true }, () =>
      axios
        .get(
          URL + '/questionaries/pages/' + this.props.questionary,
          { headers: headers },
          { cancelToken: this.source.token }
        )
        .then(response => {
          this.setState({ listPages: response.data, loading: false });
        })
        .catch(() => {
          this.setState({ loading: false });
        })
    );
  };

  getSections = () => {
    const headers = getHeader();
    this.setState({ loading: true }, () =>
      axios
        .get(
          URL + '/questionaries/sections/' + this.props.questionary,
          { headers: headers },
          { cancelToken: this.source.token }
        )
        .then(response => {
          console.log(response);
          this.setState({ listSections: response.data, loading: false });
        })
        .catch(() => {
          this.setState({ loading: false });
        })
    );
  };

  renderQuestionary = () => {
    const render = this.state.listPages.map((page, i) => (
      <Tab key={i} eventKey={page.id} title={page.name}>
        <Accordion defaultActiveKey='0'>
          {this.state.listSections.map((section, j) => {
            let ref = React.createRef();
            let card;
            const tuple = { key: j, ref: ref };
            if (section.page_id_id === page.id) {
              if (
                this.state.listRefsSections.find(element => element.key === j)
              )
                console.log('');
              else this.state.listRefsSections.push(tuple);
              if (this.state.listRefsSections.length === 0)
                this.state.listRefsSections.push(tuple);
              card = (
                <Card key={j}>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant='link' eventKey={j}>
                      {section.name}
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey={j}>
                    <Card.Body>
                      <div className='custom-section'>
                        <Container
                          className='custom-subsection'
                          id={i + '-' + j}
                          ref={
                            this.state.listRefsSections.find(
                              element => element.key === j
                            ).ref
                          }>
                          <Row>
                            <Col className='custom-col'></Col>
                            <Col className='custom-col'></Col>
                            <Col className='custom-col'></Col>
                            <Col className='custom-col'></Col>
                          </Row>
                        </Container>
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              );
            }
            return card;
          })}
        </Accordion>
      </Tab>
    ));
    console.log(this.state.listRefsSections);
    return (
      <Tabs defaultActiveKey='2' id='uncontrolled-tab-example'>
        {render}
      </Tabs>
    );
  };

  componentDidMount() {
    this.getPages();
    this.getSections();
  }

  componentWillUnmount() {
    this.source.cancel('cancel request');
  }

  render() {
    return (
      <div>
        <button
          className='btn btn-primary btn-icon-split float-right ml-1 p-0'
          onClick={this.newSection}>
          <span className='icon text-white-50'>
            <i className='fas fa-plus-square'></i>
          </span>
          <span className='text text-white'>Sección</span>
        </button>
        <button
          className='btn btn-primary btn-icon-split float-right p-0'>
          <span className='icon text-white-50'>
            <i className='fas fa-plus-square'></i>
          </span>
          <span className='text text-white'>Página</span>
        </button>
        <this.renderQuestionary />
      </div>
    );
  }
}

export default ViewQuestionary;
