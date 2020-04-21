import React, { Component, isValidElement } from 'react';
import axios from 'axios';
import { Rnd } from "react-rnd";
import { getHeader } from '../../utils/utils';
import { URL } from '../../utils/URLSever'
import { Resizable, ResizableBox } from 'react-resizable';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
import { CreateQuestion } from '../crud_question/createQuestion.component';
import {UpdateSection} from '../crud_section/updateSection.component'
import {UpdatePage} from '../crud_pages/updatePage.component'

///////////////////
// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  /*console.log('Lista')
  console.log(list)
  console.log('start index '+startIndex+' endindex '+endIndex)
  console.log('Resultado')
  console.log(result)*/
  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});
///////////////////////////////////////////////////////////



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
      listElements:[],
      pageActive:0,
      sectionActive:0,
      elementActive:0,
      countPages:0,
      countSection:0,
      nameSection:'',
      actualRef:0,
      iSecc:0,
      jSecc:0,
      kSecc:0,
      isVisibleUpdate:false,
      isVisibleSection:false,
      isVisiblePage:false,
      ///
      items: getItems(10)
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }
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
/////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////



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

    let paginas=this.refContainer.current.childNodes[1].childNodes
    let pagina=0

//Ciclo que determina que pagina esta activa
    for (let i = 0; i < paginas.length; i++) {
      if(paginas[i].className.length>20)
       pagina=i
    }
    //console.log('i')
    //console.log(pagina)
    //console.log(this.refContainer.current.childNodes[2].childNodes[pagina]
    //  .childNodes[0].childNodes[0].childNodes.length)
    const data = {
      id: ''+(pagina)+(this.refContainer.current.childNodes[2].childNodes[pagina]
        .childNodes[0].childNodes[0].childNodes.length),
      name: 'Sección ',
      i:pagina,
      j:this.refContainer.current.childNodes[2].childNodes[pagina]
      .childNodes[0].childNodes[0].childNodes.length,
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
//Campo Crear
newHandler = (type) => {
  if(this.state.listSections.length>0)
  {
      let arrayElements=this.state.listElements 
      let paginas=this.refContainer.current.childNodes[1].childNodes
      let pagina=0
      let seccionId='0-0'
      //Ciclo que encuentra la Pagina Activa
      for (let i = 0; i < paginas.length; i++) {
        if(paginas[i].className.length>20)
        pagina=i
      }
      let secciones=this.refContainer.current.childNodes[2].childNodes[pagina]
      .childNodes[0].childNodes[0].childNodes
      //console.log(secciones)
      for (let i = 0; i <secciones.length; i++) {
        //Ciclo que encuentra la Seccion Activa
        if(secciones[i].childNodes[1].className.length>8)
            seccionId=secciones[i].childNodes[1].childNodes[0].
            childNodes[0].childNodes[0].id
      }
      var arreglo=this.state.listFields;  

      var referencia=React.createRef()
      var keyElement=seccionId+'-'+Date.now()
      let elemento={
        keyElement:keyElement,
        idElement:keyElement,
        pageElement:pagina,
        sectionElement:seccionId,
        widthElement:300,
        typeElement:type,
        refElement:referencia,
        headerElement:'Pregunta '+this.state.listFields.length+' : '+'Cuantos '+Date.now()+' tiene ?'
      }
      arrayElements.push(elemento)
        this.setState(prevState => ({
          listElements:arrayElements
        }))
  }

};


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
  //console.log(namePages)
  this.setState({
    actualRef:this.refContainer,
    isVisiblePage:true,
    namePages:namePages
  });
     
}

//Seccion Nombre
changeSection=(i,j,cont)=>{
  //console.log(i+' '+' '+j)
  let paginas=this.refContainer.current.childNodes[1].childNodes
  let pagina=i
  let seccionId='0-0'
  for (let i = 0; i < paginas.length; i++) {
    if(paginas[i].className.length>20)
    pagina=i
  }
  this.setState({
    actualRef:this.refContainer,
    isVisibleSection:true,
    jSecc:j,
    iSecc:j,
    kSecc:i,
    sectionActive:cont
  });
     
}
//Elemento Nombre
changeElement(keyElement){
  let paginas=this.refContainer.current.childNodes[1].childNodes
  let pagina=0
  let seccionId='0-0'
  let ii,jj,kk

this.setState({
  actualRef:this.refContainer,
  isVisibleUpdate:true,
  elementActive:keyElement
});



}
ensayo=()=>{


  console.log(this.state.listElements)

}

handleResizeElement = (keyElement,widthElement) => {
  let arrayElements=this.state.listElements
  for (let i = 0; i <arrayElements.length; i++) {
    if(keyElement===arrayElements[i].keyElement)
    {
      arrayElements[i].widthElement=widthElement
      console.log(keyElement)
    }

  }
  this.setState(prevState => ({
    listElements:arrayElements
  })) 

};



handleUpdateQuestion = (name) => {
  let paginas=this.refContainer.current.childNodes[1].childNodes
  let namePages=[]
  let pagina=this.state.elementActive[0]
  let seccionId='0-0'
  let arrayElements=this.state.listElements
  let secciones=this.refContainer.current.childNodes[2].childNodes[pagina]
  .childNodes[0].childNodes[0].childNodes


  seccionId=secciones[this.state.elementActive[2]].childNodes[1].childNodes[0].
  childNodes[0].childNodes[0].childNodes[0].childNodes
  
  //console.log('secciones id ')
  //console.log(seccionId)
  let indexElement=0
  for (let i = 0; i <seccionId.length; i++) {
        if(seccionId[i].id===this.state.elementActive)
        {
          indexElement=i
        }
            
            
  }
  let indexElement2=0
  for(let i=0;i<arrayElements.length;i++){
      if(arrayElements[i].keyElement===this.state.elementActive)
        indexElement2=i
  }
  arrayElements[indexElement2].widthElement=seccionId[indexElement].offsetWidth
  arrayElements[indexElement2].headerElement=name
  this.setState(prevState => ({
    listElements:arrayElements
  })) 
  this.handleClose()
};
handleUpdateSection = (name) => {
  let arraySections=this.state.listSections
  arraySections[this.state.sectionActive].name=name
  this.setState(prevState => ({
    listSections:arraySections
  }))
  
  this.handleClose()

};
handleClose = () => {
  this.setState({
    isVisibleUpdate: false,
    isVisibleSection:false,
    isVisiblePage:false
  });
  //console.log(this.refContainer.current.childNodes)
};

 CustomToggle=({ children, eventKey })=> {
  const decoratedOnClick = useAccordionToggle(eventKey
    
  );
  //var i=parseInt(children.substring(children.length-1,children.length))
  //var j=parseInt(children.substring(children.length-5,children.length-4))
  var i=parseInt(children[children.length-6])
  var j=parseInt(children[children.length-5])
  var cont=parseInt(children[children.length-1])
  /*.log(cont)
  console.log(i+' '+' '+j)
  console.log(this.state.listSections)
  */

  return (
    <Link
      onClick={decoratedOnClick}
      onDoubleClick={(e) => {
        e.preventDefault();
        this.changeSection(i,j,cont)}}>
    
      {children}
    </Link>
  );
}

  renderQuestionary = () => {
    const render = this.state.listPages.map((page, i) => (
      <Tab key={i} eventKey={page.id} title={page.name}  ref = { this.refContainer }>
        <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
        <Accordion defaultActiveKey='0' >
          {this.state.listSections.map((section, j) => {
           
            if (section.page_id_id === page.id) {
                return(
                <Card key={j}>
                                  <Draggable key={i+'-'+j} draggableId={i+'-'+j} index={j}>
                {(provided, snapshot) => (
                <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                >
                  <Card.Header >
                  <this.CustomToggle eventKey={j}>{section.name+' '+section.i+section.j+'-'+i+'-'+j}</this.CustomToggle>
                  </Card.Header>

                </div>
                                  )}
                                  </Draggable>
                  <Accordion.Collapse eventKey={j} >
                    <Card.Body >
                      <div className='custom-section'>
                        <Container 
                          className='custom-subsection'
                          id={section.i + '-' + section.j}

                          >
                          <Row className='rowCuestionarie'>
                            {
                              /*
                              this.state.listElements.filter(campo => campo.keyElement.substring(0, campo.keyElement.length - 14) === ''+section.i+'-'+section.j)
                               .map((element, j) => {
                                 return(<this.renderElement element={element}/>)
                               })
                               */
                               this.state.listElements.map((element, k) => {
           
                                    if (element.keyElement.substring(0, element.keyElement.length - 14) === ''+section.i+'-'+section.j) {
                                        return(
                                 <CreateQuestion
                                 element={element}
                                 onDoubleClickElement={this.changeElement.bind(this,element.keyElement)}
                                 handleResizeElement={this.handleResizeElement}
                                 />
                                 
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
          {provided.placeholder}
        </Accordion>
        </div>
          )}
        </Droppable>
      </DragDropContext>
      </Tab>
    ));
    
    return (
      <Tabs  onDoubleClick={
        
        
        this.changePage
      } defaultActiveKey='1' id='Page'>
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

///////
orderElements=(listSections,indexSection)=>{
  console.log(listSections[indexSection].id)


  let pagina=listSections[indexSection].id[0]
  let ii=0
  let seccionId='0-0'
  let arrayElements=this.state.listElements

  let secciones=this.refContainer.current.childNodes[2].childNodes[pagina]
  .childNodes[0].childNodes[0].childNodes
  

  //console.log(secciones)
  for (let i = 0; i <secciones.length-1; i++) {
    console.log(i)
    //console.log(secciones[i])
    console.log(
    secciones[i].childNodes[1].childNodes[0].
    childNodes[0].childNodes[0].childNodes[0].childNodes)
  }
  
  this.setState(prevState => ({
    listElements:arrayElements
  })) 
  


} 

//////

///////////////////////////////////
onDragEnd(result) {
  // dropped outside the list
  if (!result.destination) {
    return;
  }

  const items = reorder(
    this.state.listSections,
    result.source.index,
    result.destination.index
  );
  console.log('despues')
  console.log(this.state.listElements)
  //this.orderElements(items,result.destination.index)
  
  this.setState({
    listSections:items
  }); 
}


////////////////////////////////////
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
             handleUpdateQuestion={this.handleUpdateQuestion}      
            
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
             handleUpdateSection={this.handleUpdateSection}  
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
