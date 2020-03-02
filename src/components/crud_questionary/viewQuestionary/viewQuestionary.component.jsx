import React, { Component } from 'react';
import axios from 'axios';

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
      listSections: []
    };
  }

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
            let card;
            if (section.page_id_id === page.id)
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
                        <Container className='custom-subsection'>
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
            return card;
          })}
        </Accordion>
      </Tab>
    ));
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
        <Button className='float-right'>+</Button>
        <this.renderQuestionary />
      </div>
    );
  }
}

export default ViewQuestionary;
