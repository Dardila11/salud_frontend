import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isThisHour } from 'date-fns';
import { Resizable, ResizableBox } from 'react-resizable';
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
    Table,
    Modal,
    Form
  } from 'react-bootstrap';
import { FormRow } from 'react-bootstrap/Form';
export class CreateQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
          value: '',
          suggestions: [],
          progress: false,
          alertMessage: '',
          alertVariant: '',
          question:'',
          element:props.element,
          alertId: 'alert-create-questionary',
          keyElement:props.element.keyElement
        };
      }
      onResize = (event, {element, size, handle}) => {
        this.props.handleResizeElement(this.props.element.keyElement,size.width)
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
                        let radio=this.props.element.properties.options.map((radio,i)=>
                        (
                            React.createElement(Form.Check,{type:'radio',
                            inline:this.state.element.properties.orientation,
                            label:radio,
                            name:'name'+this.props.element.keyElement})
                        ))
                        return radio

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

                            let options=this.props.element.properties.options.map((option,i) => {
                              return <option value={i}>           
                                  
                                  {option}</option>
                              })
                            return React.createElement(Form.Control,{as:'select',
                            className:'ml-1 p-0'},options)
                            

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
                                  src:this.props.element.properties.source,
                                  fluid:true
                                
                                },
                                  )
                                  break;
                              case 13:
                                let headerH=this.props.element.properties.options.map((option,i) => {
                                  return <td >           
                                      <Form.Label inline >{option} </Form.Label>
                                      </td>
                                  })
                                  
                                let headerV=this.props.element.properties.optionsB.map((optionB,i) => {
                                  return <tr >
                                            <td>
                                              <Form.Label inline>{optionB}</Form.Label>
                                            </td>           
                                            {this.props.element.properties.options.map((option,j) => {
                                                       return <td as={Col}>           
                                                      <Form.Check name={''+i} type="radio" aria-label="radio 1" />
                                                       </td>
                                                   })                       
                                            }
                                            
                                          </tr>
                                  })
                                return React.createElement(Table,{responsive:true,className:'tableTag', bordered:true},
                                [
                                  React.createElement
                                  ('tr',{},
                                    [
                                      React.createElement('td'),
                                      headerH,
  
  
                                    ]
                                  ),
                                  headerV
                                ]
                                
                                )

                                break
              }


}
handleChange2=()=>{
  alert()
}
 renderElement=()=>{
    if(this.props.element.typeElement==1)
    {
      var ele=React.createElement(ResizableBox, 
        {
          key:this.props.element.keyElement,
          id:this.props.element.keyElement,
          name:this.props.element.keyElement,
          bounds:'parent',
          width:this.props.element.widthElement,
          className:'element',
          onDoubleClick:this.props.onDoubleClickElement,
          axis:"x",
          onResize:this.onResize
           
          
          

 
        }
        ,this.newElement(this.props.element.typeElement)
        )
    }
    else{
    var ele=React.createElement(ResizableBox, 
    {
        key:this.props.element.keyElement,
        id:this.props.element.keyElement,
        name:this.props.element.keyElement,
        bounds:'parent',
        width:this.props.element.widthElement,
        className:'element',
        onDoubleClick:this.props.onDoubleClickElement,
        axis:"x",
        onResize:this.onResize       
    }
    , [React.createElement(Row,{},React.createElement(Form.Label,{className:'spanElement'},''+this.props.element.headerElement)),this.newElement(this.props.element.typeElement)]
      )
  }
    return ele

 } 
    render() {
        return (
            
                <this.renderElement/>
            
        )
    }
}
export default CreateQuestion