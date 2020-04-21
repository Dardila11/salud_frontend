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
  
    Modal,
    Form
  } from 'react-bootstrap';
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
          alertId: 'alert-create-questionary',
          keyElement:props.element.keyElement
        };
      }
      onResize = (event, {element, size, handle}) => {
        this.props.handleResizeElement(this.state.keyElement,size.width)
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
    , [React.createElement(Row,{className:'tagback'},React.createElement('span',{className:'spanElement'},''+this.props.element.headerElement+' : ')),this.newElement(this.props.element.typeElement)]
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