import React, { Component } from 'react'

import {
    Button,
    Modal,
    Col,
    Row,
    Form,
    Tab,
    Tabs,
    Image,
    InputGroup,
    FormControl,
    OverlayTrigger,
    Tooltip

  } from 'react-bootstrap';
import { FormRow } from 'react-bootstrap/Form';
export class UpdateQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
          suggestions: [],
          progress: false,
          alertMessage: '',
          alertVariant: '',
          question:'',
          optionReplace:'',
          optionNew:'',
          option:'',
          optionReplaceB:'',
          optionNewB:'',
          optionB:'',
          alertId: 'alert-create-questionary',
          element:props.element,
          indexElement:0,
          moveElement:0,
          listNeighbors:props.listNeighbors
        };
      }
onChangeOrientation=(event)=>{
  
        let auxElement=this.state.element
        if(event.target.value==='true')
        auxElement.properties.orientation=true
        else
        auxElement.properties.orientation=false

        this.setState({ element: auxElement });
}
onChangeMove=(event)=>{
  this.setState({moveElement:event.target.value})
}
onChangeIndex=(event)=>{
  this.setState({indexElement:event.target.value})
}
onChangeQuestion=(event)=>{
        this.setState({question:event.target.value})
}
onChangeOption=(event)=>{
  this.setState({option:event.target.value})
}
onChangeOptionN=(event)=>{
  this.setState({optionNew:event.target.value})
}
onChangeOptionR=(event)=>{
  this.setState({optionReplace:event.target.value})
}
//Opciones multidimensionales
onChangeOptionB=(event)=>{
  this.setState({optionB:event.target.value})
}
onChangeOptionNB=(event)=>{
  this.setState({optionNewB:event.target.value})
}
onChangeOptionRB=(event)=>{
  this.setState({optionReplaceB:event.target.value})
}

renderProperties=()=>{
  switch (this.state.element.typeElement) {
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
                    let orientationRadio1=false
                    let orientationRadio2=false
                    
                    if(this.state.element.properties.orientation===true)
                    {
                      orientationRadio1=true
                      orientationRadio2=false
                    }else
                    {
                      orientationRadio1=false
                      orientationRadio2=true
                    }

                    let options=this.state.element.properties.options.map((option,i) => {
                      return <option value={i}>           
                          
                          {option}</option>
                      })
                    return React.createElement('div',{},
                    [
                      React.createElement(Form.Row,{},
                      [React.createElement(Form.Label,{className:'spanElement'},'Orientación:'),
                      React.createElement(Form.Check,{type:'radio',inline:true,label:'Horizontal',name:'orientacion',value:true,onChange:this.onChangeOrientation,defaultChecked:orientationRadio1}),
                      React.createElement(Form.Check,{type:'radio',inline:true,label:'Vertical',name:'orientacion',value:false,onChange:this.onChangeOrientation,defaultChecked:orientationRadio2})
                      ]
                      ),
                      React.createElement(Form.Row,{},
                      [
                        React.createElement(Form.Group,{as:Col},
                          React.createElement(Form.Control,{as:'select',
                                      className:'ml-1 p-0',value:this.state.option,onChange:this.onChangeOption},[React.createElement('option',{},'OPCIONES'),options])
                        ),
                        React.createElement(Form.Group,{as:Col},
                          React.createElement(Form.Control,{
                            placeholder:''+this.state.element.properties.options[this.state.option],
                            value:this.state.optionReplace,
                            onChange:this.onChangeOptionR})
                        ),
                        React.createElement(Form.Group,{as:Col},
                          React.createElement(Button,{className:'btn btn-primary btn-icon-split  ml-1 p-0',onClick:this.handleOptionR},
                          [
                            React.createElement('span',{className:'icon text-white-50'},
                              React.createElement('i',{className:'far fa-edit'})),
                            React.createElement('span',{className:'text text-white'},'Renombrar')
                          ]
                          )),
                        React.createElement(Form.Group,{as:Col},
                          React.createElement(Button,{className:'btn btn-danger btn-icon-split  ml-2 p-0',onClick:this.handleOptionD},
                          [
                            React.createElement('span',{className:'icon text-white-50'},
                              React.createElement('i',{className:'fas fa-minus-circle'})),
                            React.createElement('span',{className:'text text-white'},'Borrar')
                          ]
                          )
                        )
                        
                      ]
                      ),
                      React.createElement(Form.Row,{},
                        [
                        React.createElement(Form.Group,{as:Col})
                        ,
                        React.createElement(Form.Group,{as:Col},
                          React.createElement(Form.Control,{
                            placeholder:'Nueva Opcion',
                            value:this.state.optionNew,
                            onChange:this.onChangeOptionN})
                        ),
                        React.createElement(Form.Group,{as:Col},
                          React.createElement(Button,{className:'btn btn-success btn-icon-split  ml-1 p-0',onClick:this.handleOptionN},
                          [
                            React.createElement('span',{className:'icon text-white-50'},
                              React.createElement('i',{className:'fas fa-plus-square'})),
                            React.createElement('span',{className:'text text-white'},'Agregar')
                          ]
                          )
                          ),
                          React.createElement(Form.Group,{as:Col})
                        ]
                      )
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
                        let optionsel=this.state.element.properties.options.map((option,i) => {
                          return <option value={i}>           
                              
                              {option}</option>
                          })
                        return React.createElement('div',{},
                        [

                          React.createElement(Form.Row,{},
                          [
                            React.createElement(Form.Group,{as:Col},
                              React.createElement(Form.Control,{as:'select',
                                          className:'ml-1 p-0',value:this.state.option,onChange:this.onChangeOption},[React.createElement('option',{},'OPCIONES'),optionsel])
                            ),
                            React.createElement(Form.Group,{as:Col},
                              React.createElement(Form.Control,{
                                placeholder:''+this.state.element.properties.options[this.state.option],
                                value:this.state.optionReplace,
                                onChange:this.onChangeOptionR})
                            ),
                            React.createElement(Form.Group,{as:Col},
                              React.createElement(Button,{className:'btn btn-primary btn-icon-split  ml-1 p-0',onClick:this.handleOptionR},
                              [
                                React.createElement('span',{className:'icon text-white-50'},
                                  React.createElement('i',{className:'far fa-edit'})),
                                React.createElement('span',{className:'text text-white'},'Renombrar')
                              ]
                              )),
                            React.createElement(Form.Group,{as:Col},
                              React.createElement(Button,{className:'btn btn-danger btn-icon-split  ml-2 p-0',onClick:this.handleOptionD},
                              [
                                React.createElement('span',{className:'icon text-white-50'},
                                  React.createElement('i',{className:'fas fa-minus-circle'})),
                                React.createElement('span',{className:'text text-white'},'Borrar')
                              ]
                              )
                            )
                            
                          ]
                          ),
                          React.createElement(Form.Row,{},
                            [
                            React.createElement(Form.Group,{as:Col})
                            ,
                            React.createElement(Form.Group,{as:Col},
                              React.createElement(Form.Control,{
                                placeholder:'Nueva Opcion',
                                value:this.state.optionNew,
                                onChange:this.onChangeOptionN})
                            ),
                            React.createElement(Form.Group,{as:Col},
                              React.createElement(Button,{className:'btn btn-success btn-icon-split  ml-1 p-0',onClick:this.handleOptionN},
                              [
                                React.createElement('span',{className:'icon text-white-50'},
                                  React.createElement('i',{className:'fas fa-plus-square'})),
                                React.createElement('span',{className:'text text-white'},'Agregar')
                              ]
                              )
                              ),
                              React.createElement(Form.Group,{as:Col})
                            ]
                          )
                        ]
                        
                        )
                      
                        
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

                            return React.createElement('div',{},
                            [
                          
                              React.createElement
                              (Form.Row,{},
                              
                                React.createElement
                                (Col,{},
                                  React.createElement
                                  (InputGroup,{className:"mb-2"},
                                    [
                                      React.createElement
                                      (FormControl,{placeholder:'Nueva Direccion',
                                                          value:this.state.optionNew,
                                                          onChange:this.onChangeOptionN,
                                                        }
                                      ),
                                  React.createElement(InputGroup.Append,{},
                                    React.createElement(Button,{className:'btn btn-primary btn-icon-split  ml-1 p-0',onClick:this.handleSource},
                                    [
                                      React.createElement('span',{className:'icon text-white-50'},
                                        React.createElement('i',{className:'far fa-edit'})),
                                      React.createElement('span',{className:'text text-white'},'Renombrar')
                                    ]
                                    ))
                                    ]
                                  )
                                )
                                  
                          
                              ),
                              React.createElement
                              (Row,{},
                                  React.createElement(Image,{
                                    src:this.state.element.properties.source,
                                    fluid:true,
                                    style:{maxHeight:'25%',maxWidth:'25%',
                                  padding:'1em'}
                                  
                                  },
                                    )
                                
                              )
                            ]
                            )
                            break;
                            case 13:
                              let optionsel1=this.state.element.properties.options.map((option,i) => {
                                return <option value={i}>           
                                    
                                    {option}</option>
                                })
                                let optionsel2=this.state.element.properties.optionsB.map((option,i) => {
                                  return <option value={i}>           
                                      
                                      {option}</option>
                                  })
                              return React.createElement('div',{},
                              [
                            
                                React.createElement(Form.Row,{},
                                [
                                  React.createElement(Form.Group,{as:Col},
                                    React.createElement(Form.Control,{as:'select',
                                                className:'ml-1 p-0',value:this.state.option,onChange:this.onChangeOption},[React.createElement('option',{},'OPCIONES'),optionsel1])
                                  ),
                                  React.createElement(Form.Group,{as:Col},
                                    React.createElement(Form.Control,{
                                      placeholder:''+this.state.element.properties.options[this.state.option],
                                      value:this.state.optionReplace,
                                      onChange:this.onChangeOptionR})
                                  ),
                                  React.createElement(Form.Group,{as:Col},
                                    React.createElement(Button,{className:'btn btn-primary btn-icon-split  ml-1 p-0',onClick:this.handleOptionR},
                                    [
                                      React.createElement('span',{className:'icon text-white-50'},
                                        React.createElement('i',{className:'far fa-edit'})),
                                      React.createElement('span',{className:'text text-white'},'Renombrar')
                                    ]
                                    )),
                                  React.createElement(Form.Group,{as:Col},
                                    React.createElement(Button,{className:'btn btn-danger btn-icon-split  ml-2 p-0',onClick:this.handleOptionD},
                                    [
                                      React.createElement('span',{className:'icon text-white-50'},
                                        React.createElement('i',{className:'fas fa-minus-circle'})),
                                      React.createElement('span',{className:'text text-white'},'Borrar')
                                    ]
                                    )
                                  )
                                  
                                ]
                                ),
                                React.createElement(Form.Row,{},
                                  [
                                  React.createElement(Form.Group,{as:Col})
                                  ,
                                  React.createElement(Form.Group,{as:Col},
                                    React.createElement(Form.Control,{
                                      placeholder:'Nueva Opcion',
                                      value:this.state.optionNew,
                                      onChange:this.onChangeOptionN})
                                  ),
                                  React.createElement(Form.Group,{as:Col},
                                    React.createElement(Button,{className:'btn btn-success btn-icon-split  ml-1 p-0',onClick:this.handleOptionN},
                                    [
                                      React.createElement('span',{className:'icon text-white-50'},
                                        React.createElement('i',{className:'fas fa-plus-square'})),
                                      React.createElement('span',{className:'text text-white'},'Agregar')
                                    ]
                                    )
                                    ),
                                    React.createElement(Form.Group,{as:Col})
                                  ]
                                ),
                                React.createElement(Form.Row,{},
                                  [
                                    React.createElement(Form.Group,{as:Col},
                                      React.createElement(Form.Control,{as:'select',
                                                  className:'ml-1 p-0',value:this.state.optionB,onChange:this.onChangeOptionB},[React.createElement('option',{},'OPCIONES'),optionsel2])
                                    ),
                                    React.createElement(Form.Group,{as:Col},
                                      React.createElement(Form.Control,{
                                        placeholder:''+this.state.element.properties.optionsB[this.state.optionB],
                                        value:this.state.optionReplaceB,
                                        onChange:this.onChangeOptionRB})
                                    ),
                                    React.createElement(Form.Group,{as:Col},
                                      React.createElement(Button,{className:'btn btn-primary btn-icon-split  ml-1 p-0',onClick:this.handleOptionRB},
                                      [
                                        React.createElement('span',{className:'icon text-white-50'},
                                          React.createElement('i',{className:'far fa-edit'})),
                                        React.createElement('span',{className:'text text-white'},'Renombrar')
                                      ]
                                      )),
                                    React.createElement(Form.Group,{as:Col},
                                      React.createElement(Button,{className:'btn btn-danger btn-icon-split  ml-2 p-0',onClick:this.handleOptionDB},
                                      [
                                        React.createElement('span',{className:'icon text-white-50'},
                                          React.createElement('i',{className:'fas fa-minus-circle'})),
                                        React.createElement('span',{className:'text text-white'},'Borrar')
                                      ]
                                      )
                                    )
                                    
                                  ]
                                  ),
                                  React.createElement(Form.Row,{},
                                    [
                                    React.createElement(Form.Group,{as:Col})
                                    ,
                                    React.createElement(Form.Group,{as:Col},
                                      React.createElement(Form.Control,{
                                        placeholder:'Nueva Opcion',
                                        value:this.state.optionNewB,
                                        onChange:this.onChangeOptionNB})
                                    ),
                                    React.createElement(Form.Group,{as:Col},
                                      React.createElement(Button,{className:'btn btn-success btn-icon-split  ml-1 p-0',onClick:this.handleOptionNB},
                                      [
                                        React.createElement('span',{className:'icon text-white-50'},
                                          React.createElement('i',{className:'fas fa-plus-square'})),
                                        React.createElement('span',{className:'text text-white'},'Agregar')
                                      ]
                                      )
                                      ),
                                      React.createElement(Form.Group,{as:Col})
                                    ]
                                  )
                              ]
                              
                              )                              
                            break
          }

}
handleQuestion=()=>{
  let auxElement=this.state.element
  if(this.state.question.length>0){

    auxElement.headerElement=this.state.question
    /*
    let secciones=this.props.actualRef.current.childNodes[2].childNodes[this.props.kk]
    .childNodes[0].childNodes[0].childNodes
    let seccionId=secciones[this.props.ii].childNodes[1].childNodes[0].
    childNodes[0].childNodes[0].childNodes[0].childNodes
    seccionId[this.props.jj].childNodes[0].childNodes[0].textContent=this.state.question
    console.log(seccionId[this.props.jj].childNodes[0].childNodes[0])
    this.props.handleClose();
    */
   
   //this.props.handleUpdateQuestion(this.state.question)
  }
  this.setState({ element: auxElement });



    //this.props.actualRef.current.props.children[0].props.children=this.state.question
}
handleMove=()=>{
  this.props.handleMoveElement(this.state.moveElement,this.state.indexElement)
}
handleSource=()=>{
  let auxElement=this.state.element
  if(this.state.optionNew.length>0 ){
    
    auxElement.properties.source=this.state.optionNew
  }
this.setState({ element: auxElement,
                optionNew:'' }); 
}
handleOptionD=()=>{
  
  let auxElement=this.state.element
  let auxOptions=[]
  let indexDelete=0
  if(this.state.option.length>0){
    for(let i=0;i<auxElement.properties.options.length;i++)
    {
      if(i!=this.state.option)
      {
        auxOptions[i-indexDelete]=auxElement.properties.options[i]
      }
      else{
        indexDelete=1
      }
    }
    
    auxElement.properties.options=auxOptions
}
this.setState({ element: auxElement });
}
handleOptionN=()=>{
  
  let auxElement=this.state.element
  if(this.state.optionNew.length>0 ){
    
    auxElement.properties.options.push(this.state.optionNew)
  }
this.setState({ element: auxElement,
                optionNew:'' });
}
handleOptionR=()=>{
  
  let auxElement=this.state.element
  if(this.state.option.length>0 && this.state.optionReplace.length>0){
    
    auxElement.properties.options[this.state.option]=this.state.optionReplace
}
this.setState({ element: auxElement,
                optionReplace:'' });
}

//Manejadores para multidimesnionañ
handleOptionDB=()=>{
  
  let auxElement=this.state.element
  let auxOptions=[]
  let indexDelete=0
  if(this.state.option.length>0){
    for(let i=0;i<auxElement.properties.optionsB.length;i++)
    {
      if(i!=this.state.optionB)
      {
        auxOptions[i-indexDelete]=auxElement.properties.optionsB[i]
      }
      else{
        indexDelete=1
      }
    }
    
    auxElement.properties.optionsB=auxOptions
}
this.setState({ element: auxElement });
}
handleOptionNB=()=>{
  
  let auxElement=this.state.element
  if(this.state.optionNewB.length>0 ){
    
    auxElement.properties.optionsB.push(this.state.optionNewB)
  }
this.setState({ element: auxElement,
                optionNewB:'' });
}
handleOptionRB=()=>{
  
  let auxElement=this.state.element
  if(this.state.optionB.length>0 && this.state.optionReplaceB.length>0){
    
    auxElement.properties.optionsB[this.state.optionB]=this.state.optionReplaceB
}
this.setState({ element: auxElement,
                optionReplaceB:'' });
}


DeleteQuestion=()=>{
   this.props.handleDeleteQuestion(this.state.element.keyElement)
}
handleClose = () => {
  this.props.handleClose();
};
ensayo=()=>{
  let optionsel1=this.state.element.properties.options.map((option,i) => {
    return <option value={i}>           
        
        {option}</option>
    })
    let optionsel2=this.state.element.properties.optionsB.map((option,i) => {
      return <option value={i}>           
          
          {option}</option>
      })
  return React.createElement('div',{},
  [

    React.createElement(Form.Row,{},
    [
      React.createElement(Form.Group,{as:Col},
        React.createElement(Form.Control,{as:'select',
                    className:'ml-1 p-0',value:this.state.option,onChange:this.onChangeOption},[React.createElement('option',{},'OPCIONES'),optionsel1])
      ),
      React.createElement(Form.Group,{as:Col},
        React.createElement(Form.Control,{
          placeholder:''+this.state.element.properties.options[this.state.option],
          value:this.state.optionReplace,
          onChange:this.onChangeOptionR})
      ),
      React.createElement(Form.Group,{as:Col},
        React.createElement(Button,{className:'btn btn-primary btn-icon-split  ml-1 p-0',onClick:this.handleOptionR},
        [
          React.createElement('span',{className:'icon text-white-50'},
            React.createElement('i',{className:'far fa-edit'})),
          React.createElement('span',{className:'text text-white'},'Renombrar')
        ]
        )),
      React.createElement(Form.Group,{as:Col},
        React.createElement(Button,{className:'btn btn-danger btn-icon-split  ml-2 p-0',onClick:this.handleOptionD},
        [
          React.createElement('span',{className:'icon text-white-50'},
            React.createElement('i',{className:'fas fa-minus-circle'})),
          React.createElement('span',{className:'text text-white'},'Borrar')
        ]
        )
      )
      
    ]
    ),
    React.createElement(Form.Row,{},
      [
      React.createElement(Form.Group,{as:Col})
      ,
      React.createElement(Form.Group,{as:Col},
        React.createElement(Form.Control,{
          placeholder:'Nueva Opcion',
          value:this.state.optionNew,
          onChange:this.onChangeOptionN})
      ),
      React.createElement(Form.Group,{as:Col},
        React.createElement(Button,{className:'btn btn-success btn-icon-split  ml-1 p-0',onClick:this.handleOptionN},
        [
          React.createElement('span',{className:'icon text-white-50'},
            React.createElement('i',{className:'fas fa-plus-square'})),
          React.createElement('span',{className:'text text-white'},'Agregar')
        ]
        )
        ),
        React.createElement(Form.Group,{as:Col})
      ]
    ),
    React.createElement(Form.Row,{},
      [
        React.createElement(Form.Group,{as:Col},
          React.createElement(Form.Control,{as:'select',
                      className:'ml-1 p-0',value:this.state.optionB,onChange:this.onChangeOptionB},[React.createElement('option',{},'OPCIONES'),optionsel2])
        ),
        React.createElement(Form.Group,{as:Col},
          React.createElement(Form.Control,{
            placeholder:''+this.state.element.properties.optionsB[this.state.optionB],
            value:this.state.optionReplaceB,
            onChange:this.onChangeOptionRB})
        ),
        React.createElement(Form.Group,{as:Col},
          React.createElement(Button,{className:'btn btn-primary btn-icon-split  ml-1 p-0',onClick:this.handleOptionRB},
          [
            React.createElement('span',{className:'icon text-white-50'},
              React.createElement('i',{className:'far fa-edit'})),
            React.createElement('span',{className:'text text-white'},'Renombrar')
          ]
          )),
        React.createElement(Form.Group,{as:Col},
          React.createElement(Button,{className:'btn btn-danger btn-icon-split  ml-2 p-0',onClick:this.handleOptionDB},
          [
            React.createElement('span',{className:'icon text-white-50'},
              React.createElement('i',{className:'fas fa-minus-circle'})),
            React.createElement('span',{className:'text text-white'},'Borrar')
          ]
          )
        )
        
      ]
      ),
      React.createElement(Form.Row,{},
        [
        React.createElement(Form.Group,{as:Col})
        ,
        React.createElement(Form.Group,{as:Col},
          React.createElement(Form.Control,{
            placeholder:'Nueva Opcion',
            value:this.state.optionNewB,
            onChange:this.onChangeOptionNB})
        ),
        React.createElement(Form.Group,{as:Col},
          React.createElement(Button,{className:'btn btn-success btn-icon-split  ml-1 p-0',onClick:this.handleOptionNB},
          [
            React.createElement('span',{className:'icon text-white-50'},
              React.createElement('i',{className:'fas fa-plus-square'})),
            React.createElement('span',{className:'text text-white'},'Agregar')
          ]
          )
          ),
          React.createElement(Form.Group,{as:Col})
        ]
      )
  ]
  
  )
}

    render() {
        return (
            <div>
                            <>


              <Modal.Header closeButton>
                <Modal.Title className='h3 text-gray-800 mb-0'>
                  Actualizar Elemento
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>


              <Tabs defaultActiveKey="general" id="uncontrolled-tab-example">
                              <Tab eventKey="general" title="General">
                              <Form id='formCreateProject' onSubmit={(e) => {
                          e.preventDefault();
                          this.handleQuestion()}}>
                            <Form.Row>
                              <Col>
                              <Form.Label className='spanElement'>Id:</Form.Label>
                              <Form.Label >{this.state.element.idElement}</Form.Label>
                              </Col>
                            </Form.Row>
                            <Form.Row>
                              <Col>
                              
                              <Form.Label className='spanElement'>{this.state.element.headerElement}</Form.Label>
                              </Col>
                            </Form.Row>
                  <Form.Row>
                  <Col>
                  <InputGroup className="mb-2">
                                  <FormControl
                                    aria-label="Recipient's username"
                                    aria-describedby="basic-addon2"
                                    placeholder='Nuevo Encabezado'
                                    value={this.state.question}
                                    onChange={this.onChangeQuestion}
                                  />
                                  <InputGroup.Append>
                                  <Button
                                  className='btn btn-primary btn-icon-split  ml-1 p-0'
                                  type='submit'>
                                  <span className='icon text-white-50'>
                                    <i className='far fa-edit'></i>
                                  </span>
                                  <span className='text text-white'>Renombrar</span>
                            </Button>
                                  </InputGroup.Append>
                                </InputGroup>
                                </Col>
                  </Form.Row>
                  <Form.Row>
                  <Col>
                      <Form.Control as='select' value={this.state.moveElement} onChange={this.onChangeMove}>
                            <option value={0}>MOVIMIENTO</option>
                            <option value={1}>Antes de</option>
                            <option value={2}>Intercambiar con</option>
                            <option value={3}>Despues de</option>

                          </Form.Control>

                      </Col>
                      <Col>
                          <Form.Control as='select'value={this.state.indexElement} onChange={this.onChangeIndex}>
                            <option value={0}>Mover</option>
                            {
                              this.state.listNeighbors.map((neighbor,i) => {
                                  return <option value={i+1}>           
                                  
                                  {neighbor.id+'|'+neighbor.header}</option>

                                  })
                              
                            }
                          </Form.Control>
                      </Col>

                      <Col>
                      <Button
                                  className='btn btn-primary btn-icon-split  ml-1 p-0'
                                  onClick={this.handleMove}>
                                  <span className='icon text-white-50'>
                                    <i className='fas fa-arrows-alt-h'></i>
                                  </span>
                                  <span className='text text-white'>Mover</span>
                            </Button>

                      </Col>

                  </Form.Row>
                </Form>
                              </Tab>
                              <Tab eventKey="propiedades" title="Propiedades">
                               <this.renderProperties/>   



                                      
                              </Tab>
                              <Tab eventKey="variable" title="Variable" >
                              algo
                              </Tab>
                            </Tabs>
              

              </Modal.Body>
              <Modal.Footer>
              <Button
                                  className='btn btn-danger btn-icon-split  ml-0 p-0'
                                  onClick={this.DeleteQuestion}
                                  style={{position:'absolute',
                                          left:'1em'}}
                                  type='submit'>
                                  <span className='icon text-white-50'>
                                    <i className='fas fa-minus-circle'></i>
                                  </span>
                                  <span className='text text-white'>Eliminar</span>
                            </Button>

                <Button className='btn btn-secondary btn-icon-split  ml-1 p-0' onClick={this.handleClose}>
               
                                  <span className='text text-white'>Cerrar</span>
                </Button>

              </Modal.Footer>
            </>
            </div>
        )
    }
}

export default UpdateQuestion
