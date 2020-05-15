import React, { Component } from 'react'

import {
    Button,
    Modal,
    Col,
    Row,
    Form
  } from 'react-bootstrap';
  import { toCapitalizer } from '../../utils/utils'
export class UpdatePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          value: '',
          suggestions: [],
          progress: false,
          alertMessage: '',
          alertVariant: '',
          page:'',
          name:'',
          alertId: 'alert-create-pageary'
        };
      }
onChangePage=(event)=>{
        this.setState({page:event.target.value})
}
onChangeName=(event)=>{
    this.setState({name:event.target.value})
}
handlePage=()=>{
  if(this.state.page.length>0 && this.state.name.length>0){
    this.props.handleUpdatePage(toCapitalizer(''+this.state.page),this.state.name)
      console.log(this.state.name)
  }
  
  this.props.handleClose();

  
    //this.props.actualRef.current.props.children[0].props.children=this.state.page
}
handleClose = () => {
  this.props.handleClose();
};
    render() {
        var names=this.props.listPages.map((page,i) => {
        return <option value={i}>           
            
            {page.name}</option>
        }
        )
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
                          this.handlePage()}}>
                
                  <Form.Row>
                  <Form.Group as={Col} md='3' controlId='inputId'>
                      <Form.Label>
                        Pagina
                      </Form.Label>
                      <Form.Control as="select" custom
                      
                      value={this.state.name}
                      onChange={this.onChangeName}
                      
                      >
                          <option >----</option>
                        {names}  
                        
                      </Form.Control>
                      
                    </Form.Group>
                    <Form.Group as={Col} md='3' controlId='inputId'>
                      <Form.Label>
                        Nuevo Nombre
                      </Form.Label>
                      <Form.Control
                        type='text'
                        name='code'
                        placeholder='Nueva Nombre'
                        value={this.state.page}
                        onChange={this.onChangePage}
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

export default UpdatePage
