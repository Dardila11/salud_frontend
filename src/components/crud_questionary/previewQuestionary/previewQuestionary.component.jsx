import React, { Component } from 'react'
import './previewQuestionary.styles.css'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { Resizable, ResizableBox } from 'react-resizable';
import { Link } from 'react-router-dom';
import {
    Accordion,
    Card,
    Container,
    Button,
    Row,
    Col,
    Tab,
    Tabs,
    Image,  
  
    Modal,
    Form
  } from 'react-bootstrap';
export class PreviewQuestionary extends Component {


    constructor(props) {
        super(props);
        this.state = {
                listPages:props.listPages
        };
      }

//Elemento crear  
newElement=(type)=>{
    switch (type) {
        case 1: 
          return React.createElement('h1', {}, );
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
                                        [ React.createElement('label',{htmlFor:'opcion1'},' Opcion 1')]),React.createElement('input',{type:'radio',id:'opcion1',value:'Opcion 1',checked:true,name:'opciones'}),
                                       ,
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
                              case 12:
  
                                return React.createElement(Image,{
                                  src:'https://www.almudenaseguros.es/blog/wp-content/uploads/2018/03/e-salud.png',
                                  fluid:true
                                
                                },
                                  )
              }


}

handleClose=()=>{
    this.props.handleClose()
}
///////
renderElement=(prop)=>{
    console.log('prop')
    console.log(prop.element)
    if(prop.element.typeElement==1)
    {
      var ele=React.createElement(ResizableBox, 
        {
            key:prop.element.keyElement,
            id:prop.element.keyElement,
            name:prop.element.keyElement,
            bounds:'parent',
            width:prop.element.widthElement,
            className:'previewElement',
            axis:"none",
          
        }
        ,this.newElement(prop.element.typeElement)
        )
    }
    else{
    var ele=React.createElement(ResizableBox, 
    {
        key:prop.element.keyElement,
        id:prop.element.keyElement,
        name:prop.element.keyElement,
        bounds:'parent',
        width:prop.element.widthElement,
        className:'previewElement',
        axis:"none",       
    }
    , [React.createElement(Row,{className:'tagback'},React.createElement('span',{className:'spanElement'},''+prop.element.headerElement)),this.newElement(prop.element.typeElement)]
      )
  }
    return ele
  } 
  
  CustomToggle=({ children, eventKey })=> {
    const decoratedOnClick = useAccordionToggle(eventKey
      
    );
    
  
    return (
      <div
        className='sectionTitle'>
      
        {children}
      </div>
    );
  }


    renderQuestionary = () => {
        const render = this.props.listPages.map((page, i) => (
            <Tab key={i} className='sectionTitle' eventKey={page.id} title={page.name}>
   
              <Accordion defaultActiveKey='0' >
                {this.props.listSections.map((section, j) => {
                 
                  if (section.page_id_id === page.id) {
                      return(
                      <Card key={j}>
  
                        <Card.Header >
                        <this.CustomToggle eventKey='0'>{section.name}</this.CustomToggle>
                        </Card.Header>   
  
                        <Accordion.Collapse eventKey='0' >
                          <Card.Body >
                            <div className='preview-section'>
                              <Container 
                                className='preview-subsection'
                                id={section.i + '-' + section.j}
      
                                >
                                <Row className='rowCuestionarie'>
                                  {
  
                                     this.props.listElements.map((element, k) => {
                 
                                          if (element.keyElement.substring(0, element.keyElement.length - 14) === ''+section.i+'-'+section.j) {
                                              return(
                                                  <this.renderElement element={element}/>
                                       
                                       )
                                     }})                              
                                  }
                                  
                                </Row>
                              </Container>
                            </div>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>)
                    
         } } )}
              </Accordion>
            </Tab>
          ));
          
          return (
            <Tabs  defaultActiveKey='1' id='Page'>
              {render}
            </Tabs>
          );
      };

      componentDidMount() {
        console.log(this.props)
      }
    render() {
        return (
            <div>
                           <div>
                            <>
              <Modal.Header closeButton>
                <Modal.Title className='h3 text-gray-800 mb-0'>
                  Previsualizacion de  cuestionario
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <this.renderQuestionary />
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={this.handleClose}>
                  Cerrar
                </Button>

              </Modal.Footer>
            </>
            </div>
            </div>
        )
    }
}
