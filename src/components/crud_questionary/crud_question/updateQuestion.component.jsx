import React, { Component } from 'react'

import {
    Button,
    Modal,
    Col,
    Row,
    Form
  } from 'react-bootstrap';
export class UpdateQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
          value: '',
          suggestions: [],
          progress: false,
          alertMessage: '',
          alertVariant: '',
          question:'',
          alertId: 'alert-create-questionary'
        };
      }
onChangeQuestion=(event)=>{
        this.setState({question:event.target.value})
}
handleQuestion=()=>{
  if(this.state.question.length>0){
    let secciones=this.props.actualRef.current.childNodes[2].childNodes[this.props.kk]
    .childNodes[0].childNodes
    let seccionId=secciones[this.props.ii].childNodes[1].childNodes[0].
    childNodes[0].childNodes[0].childNodes[0].childNodes
    seccionId[this.props.jj].childNodes[0].textContent=this.state.question
    this.props.handleClose();
  }
    //this.props.actualRef.current.props.children[0].props.children=this.state.question
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
                  Actualizar cuestionario
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <Form id='formCreateProject' onSubmit={(e) => {
                          e.preventDefault();
                          this.handleQuestion()}}>
                
                  <Form.Row>
                    <Form.Group as={Col} md='3' controlId='inputId'>
                      <Form.Label>
                        Nueva Pregunta 
                      </Form.Label>
                      <Form.Control
                        type='text'
                        name='code'
                        placeholder='Nueva Pregunta'
                        value={this.state.question}
                        onChange={this.onChangeQuestion}
                      />
                    </Form.Group>
                  </Form.Row>
                </Form>
           
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={this.handleClose}>
                  Cerrar
                </Button>
                <Button form='formCreateProject' type='submit'>
                  Actualizar Pregunta
                </Button>
              </Modal.Footer>
            </>
            </div>
        )
    }
}

export default UpdateQuestion
