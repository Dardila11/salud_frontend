import React, { Component } from 'react'
import { toCapitalizer } from '../../utils/utils'
import {
    Button,
    Modal,
    Col,
    Row,
    Form,
    InputGroup,
    FormControl
  } from 'react-bootstrap';
export class UpdateSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
          value: '',
          suggestions: [],
          progress: false,
          alertMessage: '',
          alertVariant: '',
          section:'',
          alertId: 'alert-create-sectionary'
        };
      }
onChangeSection=(event)=>{
        this.setState({section:event.target.value})
}
handleSection=()=>{
  if(this.state.section.length>0){
/*
    let secciones=this.props.actualRef.current.childNodes[2].childNodes[this.props.kk]
    .childNodes[0].childNodes[0].childNodes

    
    secciones[this.props.jj].childNodes[0].childNodes[0].childNodes[0].text=toCapitalizer(this.state.section)
    console.log('dato seccion')
    console.log(secciones[this.props.jj].childNodes[0].childNodes[0].childNodes[0])
    this.props.handleClose();*/
    this.props.handleUpdateSection(toCapitalizer(this.state.section))
  }
    //this.props.actualRef.current.props.children[0].props.children=this.state.section
}
handleClose = () => {
  this.props.handleClose();
};
    render() {
        return (
            <div>
                            <>
              <Modal.Header closeButton>
                <Modal.Title className='h3 text-gray-800 mb-0'>
                  Actualizar Seccion
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <Form id='formCreateProject' onSubmit={(e) => {
                          e.preventDefault();
                          this.handleSection()}}>

<Form.Row>
                  <Col>
                  <InputGroup className="mb-2">
                                  <FormControl
                                    placeholder="Nuevo Nombre"
                                    aria-label="Recipient's username"
                                    aria-describedby="basic-addon2"
                                    placeholder='Nueva Pregunta'
                                    value={this.state.section}
                                    onChange={this.onChangeSection}
                                  />
                                  <InputGroup.Append>
                                  <button
                                  className='btn btn-primary btn-icon-split  ml-1 p-0'
                                  type='submit'>
                                  <span className='icon text-white-50'>
                                    <i className='far fa-edit'></i>
                                  </span>
                                  <span className='text text-white'>Renombrar</span>
                            </button>
                                  </InputGroup.Append>
                                </InputGroup>
                                </Col>
                  </Form.Row>

                </Form>
           
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={this.handleClose}>
                  Cerrar
                </Button>

              </Modal.Footer>
            </>
            </div>
        )
    }
}

export default UpdateSection
