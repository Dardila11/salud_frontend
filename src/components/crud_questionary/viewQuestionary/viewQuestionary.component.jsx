import React, { Component } from 'react';
import axios from 'axios';
import { Rnd } from "react-rnd";
import { getHeader } from '../../utils/utils';
import { URL } from '../../utils/URLSever'
import { Resizable, ResizableBox } from 'react-resizable';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
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

import './viewQuestionary.styles.css';
import { UpdateQuestion } from '../crud_question/updateQuestion.component';
import {UpdateSection} from '../crud_section/updateSection.component'
import {UpdatePage} from '../crud_pages/updatePage.component'
class ViewQuestionary extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();
//Constructor
  constructor(props) {
    super(props);
    this.refContainer = React.createRef()
    this.refFields = React.createRef()
    this.state = {
      listPages: [],
      namePages:[],
      listSections: [],
      listPageNews: [],
      listSectionsNews: [],
      listRefsSections: [],
      listFields:[],
      pageActive:0,
      countPages:0,
      countSection:0,
      nameSection:'',
      actualRef:0,
      iSecc:0,
      jSecc:0,
      kSecc:0,
      isVisibleUpdate:false,
      isVisibleSection:false,
      isVisiblePage:false
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
  //Seccion
  newSection = () => {
    var arreglo = this.state.listSections;
    

    //console.log(this.refContainer.current.childNodes[3].
      //childNodes[0].childNodes[0])
      //*************************************i */
    let paginas=this.refContainer.current.childNodes[1].childNodes
    let pagina=0
    for (let i = 0; i < paginas.length; i++) {
      if(paginas[i].className.length>20)
       pagina=i
    }
    console.log(this.refContainer.current.childNodes)
    const data = {
      id: ''+(pagina)+(this.refContainer.current.childNodes[2].childNodes[pagina]
        .childNodes[0].childNodes.length),
      name: 'Sección '+(pagina)+(this.refContainer.current.childNodes[2].childNodes[pagina]
        .childNodes[0].childNodes.length),
      i:pagina,
      j:this.refContainer.current.childNodes[2].childNodes[pagina]
      .childNodes[0].childNodes.length,
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
//AxioPaginas
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
          this.setState({ listPages: response.data, loading: false }, () => {
            this.pagesEmpty();
        });
        })
        .catch(() => {
          this.setState({ loading: false });
        })
    );
  };
//AxioSecciones
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
//Campo Crear
  newHandler = (type) => {
    if(this.state.listSections.length>0)
    {
        let paginas=this.refContainer.current.childNodes[1].childNodes
        let pagina=0
        let seccionId='0-0'
        for (let i = 0; i < paginas.length; i++) {
          if(paginas[i].className.length>20)
          pagina=i
        }
        let secciones=this.refContainer.current.childNodes[2].childNodes[pagina]
        .childNodes[0].childNodes
        console.log(secciones)
        for (let i = 0; i <secciones.length; i++) {
          if(secciones[i].childNodes[1].className.length>8)
              seccionId=secciones[i].childNodes[1].childNodes[0].
              childNodes[0].childNodes[0].id
        }
        var arreglo=this.state.listFields;  

        var referencia=React.createRef()
        var keyElement=seccionId+'-'+Date.now()
        if(type==1)
        {
          var ele=React.createElement(ResizableBox, 
            {
              key:keyElement,
              id:keyElement,
              ref :referencia,
              bounds:'parent',
              width:300,
              className:'element',
              onDoubleClick:this.changeElement.bind(this,keyElement),
              axis:"x"        
            }
            ,this.newElement(type)
            )
        }
        else{
        var ele=React.createElement(ResizableBox, 
        {
          key:keyElement,
          id:keyElement,
          ref :referencia,
          bounds:'parent',
          width:300,
          className:'element',
          onDoubleClick:this.changeElement.bind(this,keyElement),
          axis:"x"        
        }
        , [React.createElement(Row,{className:'tagback'},React.createElement('span',{className:'spanElement'},'Pregunta '+this.state.listFields.length+' : '+'Cuantos '+Date.now()+' tiene ?')),this.newElement(type)]
          )
      }

          arreglo.push(ele)
          this.setState(prevState => ({
            listFields:arreglo
          }))
    }

  };
//Elemento crear  
  newElement=(type)=>{
    switch (type) {
        case 1: 
          return React.createElement('h1', {}, 'Separador');
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

pagesEmpty(){
  if(this.state.listPages.length===0 ||!this.state.listPages ){
    this.newPage()
  }
  
}
//Seccion Nombre
changePage=()=>{
  
  let paginas=this.refContainer.current.childNodes[1].childNodes
  let namePages=[]
  let pagina=0
  let seccionId='0-0'
  for (let i = 0; i < paginas.length; i++) {
    namePages[i]=paginas[i].text    
  }
  console.log(namePages)
  this.setState({
    actualRef:this.refContainer,
    isVisiblePage:true,
    namePages:namePages
  });
     
}

//Seccion Nombre
changeSection=(i,j)=>{
  console.log(i+' '+' '+j)
  let paginas=this.refContainer.current.childNodes[1].childNodes
  let pagina=0
  let seccionId='0-0'
  for (let i = 0; i < paginas.length; i++) {
    if(paginas[i].className.length>20)
    pagina=i
  }
  this.setState({
    actualRef:this.refContainer,
    isVisibleSection:true,
    jSecc:j,
    iSecc:i,
    kSecc:pagina
  });
     
}
//Elemento Nombre
changeElement(keyElement){
  let paginas=this.refContainer.current.childNodes[1].childNodes
  let pagina=0
  let seccionId='0-0'
  let ii,jj,kk
  for (let i = 0; i < paginas.length; i++) {
    if(paginas[i].className.length>20)
    pagina=i
  }
  let secciones=this.refContainer.current.childNodes[2].childNodes[pagina]
  .childNodes[0].childNodes
  console.log(secciones)
  for (let i = 0; i <secciones.length; i++) {
    if(secciones[i].childNodes[1].className.length>8)
    {
        seccionId=secciones[i].childNodes[1].childNodes[0].
        childNodes[0].childNodes[0].childNodes[0].childNodes
        ii=i
    }
  }
  for (let i = 0; i <seccionId.length; i++) {
        if(seccionId[i].id===keyElement)
            jj=i
            
  }
  //let ntabs=this.refContainer.current.childNodes[2].childNodes.length-1
  
  //let secciones=this.refContainer.current.childNodes[2].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[i].id
  //              this.refContainer.current.childNodes[2].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent
   // let secciones=this.refContainer.current.childNodes[2].childNodes[i].childNodes[j].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent
//console.log(      this.refContainer.current.childNodes[2].childNodes[ii].childNodes[0].childNodes[jj-ii])
  //console.log(ii+' '+jj+' ')
  // console.log(secciones)
 //seccionId=secciones[i].childNodes[1].childNodes[0].
 //childNodes[0].childNodes[0].id
 
  this.setState({
    actualRef:this.refContainer,
    isVisibleUpdate:true,
    jSecc:jj,
    iSecc:ii,
    kSecc:pagina
  });
  
}
ensayo=()=>{
  alert()

}
handleClose = () => {
  this.setState({
    isVisibleUpdate: false,
    isVisibleSection:false,
    isVisiblePage:false
  });
};

 CustomToggle=({ children, eventKey })=> {
  const decoratedOnClick = useAccordionToggle(eventKey, () =>
    console.log('totally custom!'),
  );
  var i=parseInt(children.substring(children.length-1,children.length))
  var j=parseInt(children.substring(children.length-5,children.length-4))
  console.log('[['+children.substring(children.length-1,children.length)+' '+children.substring(children.length-5,children.length-4))
  

  return (
    <Link
      onClick={decoratedOnClick}
      onDoubleClick={(e) => {
        e.preventDefault();
        this.changeSection(i,j)}}>
    
      {children}
    </Link>
  );
}
  renderQuestionary = () => {
    const render = this.state.listPages.map((page, i) => (
      <Tab key={i} eventKey={page.id} title={page.name}  ref = { this.refContainer }>
        <Accordion defaultActiveKey='0' >
          {this.state.listSections.map((section, j) => {
            //console.log(section)
            let ref = React.createRef();
          
            let card;
            
            const tuple = { key: j, ref: ref };
            if (section.page_id_id === page.id) {

              card = (
                
                <Card key={j}>
                  <Card.Header >
                  <this.CustomToggle eventKey={j}>{section.name+'-'+i+'-'+j}</this.CustomToggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey={j} >
                    <Card.Body >
                      <div className='custom-section'>
                        <Container 
                          className='custom-subsection'
                          id={i + '-' + j}

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
      <Tabs onDoubleClick={this.changePage} defaultActiveKey='1' id='Page'>
        {render}
      </Tabs>
    );
  };

  UNSAFE_componentWillMount() {
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
          className='btn btn-primary btn-icon-split float-right p-0'
          type='button'
          onClick={this.newPage}>
          <span className='icon text-white-50'>
            <i className='fas fa-plus-square'></i>
          </span>
          <span className='text text-white'>Página</span>
        </button>
        <this.renderQuestionary />
        <button
          className='btn btn-primary btn-icon-split float-right ml-1 p-0'
          onClick={this.newSection}
          type='button'>
          <span className='icon text-white-50'>
            <i className='fas fa-plus-square'></i>
          </span>
          <span className='text text-white'>Sección</span>
        </button>

        <Modal
          size='lg'
          show={this.state.isVisibleUpdate}
          onHide={this.handleClose}>
          {/* Actualizar Proyecto */}
          <UpdateQuestion
             handleCloseCreate={this.handleCloseCreate}
             handleClose={this.handleClose}
             actualRef={this.state.actualRef}  
             ii={this.state.iSecc}  
             jj={this.state.jSecc} 
             kk={this.state.kSecc}        
            
          />
        </Modal>
        <Modal
          size='lg'
          show={this.state.isVisibleSection}
          onHide={this.handleClose}>
          {/* Actualizar Proyecto */}
          <UpdateSection
             handleCloseCreate={this.handleCloseCreate}
             handleClose={this.handleClose}
             actualRef={this.state.actualRef}  
             ii={this.state.iSecc}  
             jj={this.state.jSecc} 
             kk={this.state.kSecc}  
          />

        </Modal>
        <Modal
          size='lg'
          show={this.state.isVisiblePage}
          onHide={this.handleClose}>
          {/* Actualizar Proyecto */}
          <UpdatePage
             handleCloseCreate={this.handleCloseCreate}
             handleClose={this.handleClose}
             actualRef={this.state.actualRef}  
             namePages={this.state.namePages} 
          />

        </Modal>




      </div>
    );
  }
}

export default ViewQuestionary;
