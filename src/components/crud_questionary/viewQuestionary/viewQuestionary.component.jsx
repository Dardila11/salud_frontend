import React, { Component } from 'react';
import axios from 'axios';
import { Rnd } from "react-rnd";
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
    this.refContainer = React.createRef()
    this.refFields = React.createRef()
    this.state = {
      listPages: [],
      listSections: [],
      listPageNews: [],
      listSectionsNews: [],
      listRefsSections: [],
      listFields:[],
      pageActive:0,
      countPages:0,
      countSection:0
    };
  }
  newPage = () => {
    var arreglo = this.state.listPages;
    const data = {
      id: this.state.countPages+1,
      name: 'Page '+(this.state.countPages+1)
    };
    arreglo.push(data)
    this.setState({ listPages:arreglo});
    this.setState((previo)=>({countPages:previo.countPages+1}))
    

  };
  newSection = () => {
    var arreglo = this.state.listSections;
    

    //console.log(this.refContainer.current.childNodes[3].
      //childNodes[0].childNodes[0])
      //*************************************i */
    let paginas=this.refContainer.current.childNodes[2].childNodes
    let pagina=0
    for (let i = 0; i < paginas.length; i++) {
      if(paginas[i].className.length>20)
       pagina=i
    }
    const data = {
      id: this.state.countSection+1,
      name: 'Sección '+(pagina+1)+(this.state.countSection+1),
      page_id_id:pagina+1,
      pos_y: 1
    };
    //this.state.listSectionsNews.push(data);
    //this.state.listSections.push(data);
    arreglo.push(data)
    this.setState({ listSections:arreglo});
    //console.log('__________________________--')
    //console.log(this.state.listSections)
    this.setState((previo)=>({countSection:previo.countSection+1}))


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
          //console.log(response.data);
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
          //console.log(response);
          this.setState({ listSections: response.data, loading: false });
        })
        .catch(() => {
          this.setState({ loading: false });
        })
    );
  };
  newHandler = (type) => {
    if(this.state.listSections.length>0)
    {
        let paginas=this.refContainer.current.childNodes[2].childNodes
        let pagina=0
        let seccionId='0-0'
        for (let i = 0; i < paginas.length; i++) {
          if(paginas[i].className.length>20)
          pagina=i
        }
        let secciones=this.refContainer.current.childNodes[3].childNodes[pagina]
        .childNodes[0].childNodes
        console.log(secciones)
        for (let i = 0; i <secciones.length; i++) {
          if(secciones[i].childNodes[1].className.length>8)
              seccionId=secciones[i].childNodes[1].childNodes[0].
              childNodes[0].childNodes[0].id
        }
        var arreglo=this.state.listFields;  
        var ele=React.createElement(Rnd, 
        {
            key:seccionId+'-'+Date.now(),
            //ref :referencia,
            bounds:'parent',
            resizeGrid: [100,100],
            dragGrid: [50,50],
            className:'element'       
        }
        , this.newElement(type)
          )

          arreglo.push(ele)
          this.setState(prevState => ({
            listFields:arreglo
          }))
    }

  };  
  newElement=(type)=>{
    switch (type) {
        case 1: 
          return React.createElement('h1', {}, 'Titulo');
          break;
        case 2:
            return React.createElement('p', {
            },'*********************************************************************************************Este es un texto de prueba con una longitud de 250 caracteres*********************************************************************************************');
            break;
            case 3:
                return React.createElement('input', {
                    type:'text'
                });
                break;
                case 4:
                  return React.createElement('textarea', {
                  });
                  break;
                  case 5:
                    return React.createElement('input', {
                      type:'number'
                    });
                    break;
                    case 6:
                      return React.createElement('input', {
                        type:'float'
                      });
                      break;
                      case 7:
                        return React.createElement('div',{},[
                                        React.createElement('div',{},
                                        [React.createElement('input',{type:'radio',id:'opcion1',value:'Opcion 1',checked:true,name:'opciones'}),
                                        React.createElement('label',{htmlFor:'opcion1'},' Opcion 1')]),
                                        React.createElement('div',{},
                                        [React.createElement('input',{type:'radio',id:'opcion2',value:'Opcion 2',name:'opciones'}),
                                        React.createElement('label',{htmlFor:'opcion2'},' Opcion 2')]),
                                        React.createElement('div',{},
                                        [React.createElement('input',{type:'radio',id:'opcion3',value:'Opcion 3',name:'opciones'}),
                                        React.createElement('label',{htmlFor:'opcion3'},' Opcion 3')])

                        ]
                                        )
                        break;
                        case 8:
                          return React.createElement('div',{},
                          [React.createElement('input',{type:'checkbox',id:"c1",value:"first"}),
                          React.createElement('label',{htmlFor:'c1'},'Opcion 1'),
                          React.createElement('input',{type:'checkbox',id:"c2",value:"second_checkbox"}),
                          React.createElement('label',{htmlFor:'c2'},'Opcion 2')
                          ])
                          break;
                          case 9:
                            return React.createElement('select',{},
                            [React.createElement('option',{value:'opcion1',selected:true},'Opcion 1'),
                            React.createElement('option',{value:'opcion2'},'Opcion 2'),
                            React.createElement('option',{value:'opcion3'},'Opcion 3'),
                            React.createElement('option',{value:'opcion4'},'Opcion 4')
                            ])
                            break;
                            case 10:
                              return React.createElement('input', {
                                  type:'date'
                              });
                              break;
                              case 11:
                                return React.createElement('input', {
                                    type:'file'
                                });
                                break;
              }


}
ensayo=()=>{
  alert()

}
  renderQuestionary = () => {
    const render = this.state.listPages.map((page, i) => (
      <Tab key={i} eventKey={page.id} title={page.name} ref = { this.refContainer }>
        <Accordion defaultActiveKey='0' >
          {this.state.listSections.map((section, j) => {
            //console.log(section)
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
                    <Accordion.Toggle as={Button} variant='link' eventKey={j} >
                      {section.name} 
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey={j} >
                    <Card.Body >
                      <div className='custom-section'>
                        <Container 
                          className='custom-subsection'
                          id={i + '-' + j}
                          ref={
                            this.state.listRefsSections.find(
                              element => element.key === j
                            ).ref
                          }
                          >
                          <Row className='rowCuestionarie'>
                            {
                              this.state.listFields.filter(campo => campo.key.substring(0, campo.key.length - 14) === ''+i+'-'+j) 
                             
                           
                            }
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
    
    return (
      <Tabs defaultActiveKey='1' id='Page'>
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
      <div ref = { this.refContainer}>
        <button
          className='btn btn-primary btn-icon-split float-right ml-1 p-0'
          onClick={this.newSection}>
          <span className='icon text-white-50'>
            <i className='fas fa-plus-square'></i>
          </span>
          <span className='text text-white'>Sección</span>
        </button>
        <button
          className='btn btn-primary btn-icon-split float-right p-0'
          onClick={this.newPage}>
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
