import React, { Component } from 'react';

import { Collapse } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';

import '../css/fontello.css';
import '../navbarLateral.styles.css';
import '../../../../vendor/fontawesome-free/css/all.min.css';

class NavBarLateralQuestionary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapseTittle: false,
      isCollapseText: false,
      isCollapseNum: false,
      isCollapseSpecial: false,
      isToogle: false
    };
  }

  handleCollapseTittle = () => {
    this.setState({
      isCollapseTittle: !this.state.isCollapseTittle,
      isCollapseText: false,
      isCollapseNum: false,
      isCollapseSpecial: false
    });
  };

  handleCollapseText = () => {
    this.setState({
      isCollapseText: !this.state.isCollapseText,
      isCollapseTittle: false,
      isCollapseNum: false,
      isCollapseSpecial: false
    });
  };

  handleCollapseNum = () => {
    this.setState({
      isCollapseNum: !this.state.isCollapseNum,
      isCollapseTittle: false,
      isCollapseText: false,
      isCollapseSpecial: false
    });
  };

  handleCollapseSpecial = () => {
    this.setState({
      isCollapseSpecial: !this.state.isCollapseSpecial,
      isCollapseTittle: false,
      isCollapseText: false,
      isCollapseNum: false
    });
  };

  render() {
    const path = window.location.pathname;
    const isActive =
      path.endsWith('/users') || path.endsWith('/users/') ? 0 : 1;
    return (
      <ul
        className={
          'navbar-nav bg-gradient-primary sidebar sidebar-dark accordion ' +
          (this.props.isToogle ? 'toggled' : '')
        }
        id='accordionSidebar'>
        <a
          className='sidebar-brand d-flex align-items-center justify-content-center'
          href='index.html'>
          <div className='sidebar-brand-icon'>
            <i className='demo-icon icon-fa-salud'></i>
          </div>
          <div className='sidebar-brand-text my-text'>ClinDesign</div>
        </a>
        <hr className='sidebar-divider my-0'></hr>
        <li className='nav-item active'>
          <a className='nav-link' href='index.html'>
            <i className='fas fa-fw fa-tachometer-alt'></i>
            <span>Modo diseño</span>
          </a>
        </li>
        <hr className='sidebar-divider mb-0'></hr>
        <li className='active nav-item hover'>
          <a className='nav-link' onClick={() => this.props.history.goBack()}>
            <i className='fas fa-caret-square-left'></i>
            <span>Retornar</span>
          </a>
        </li>
        <hr className='sidebar-divider'></hr>
        <div className='sidebar-heading'>Elementos</div>
        <li className={isActive === 0 ? 'active nav-item' : 'nav-item'}>
          <div
            role='button'
            className='nav-link'
            data-toggle='collapse'
            onClick={this.handleCollapseTittle}>
            <i className='fas fa-spell-check'></i>
            <span>Separador</span>
          </div>
          <Collapse in={this.state.isCollapseTittle}>
            <div className='bg-white py-2 collapse-inner rounded'>
              <h6 className='collapse-header'>Formatos:</h6>
              <div className='collapse-item' onClick={()=>{this.props.idElement(1)}}>Normal</div>
            </div>
          </Collapse>
        </li>
        <li className={isActive === 0 ? 'active nav-item' : 'nav-item'}>
          <div
            role='button'
            className='nav-link'
            data-toggle='collapse'
            onClick={this.handleCollapseText}>
            <i className='fas fa-sort-alpha-up'></i>
            <span>Texto</span>
          </div>
          <Collapse in={this.state.isCollapseText}>
            <div className='bg-white py-2 collapse-inner rounded'>
              <h6 className='collapse-header'>Formatos:</h6>
              <div className='collapse-item active' onClick={()=>{this.props.idElement(2)}}>Texto 250 caracteres</div>
              <div className='collapse-item'>Texto libre</div>
            </div>
          </Collapse>
        </li>
        <li className={isActive === 0 ? 'active nav-item' : 'nav-item'}>
          <div
            role='button'
            className='nav-link'
            data-toggle='collapse'
            onClick={this.handleCollapseTittle}>
            <i className='fas fa-spell-check'></i>
            <span>Entrada Texto</span>
          </div>
          <Collapse in={this.state.isCollapseTittle}>
            <div className='bg-white py-2 collapse-inner rounded'>
              <h6 className='collapse-header'>Formatos:</h6>
              <div className='collapse-item' onClick={()=>{this.props.idElement(3)}}>Normal</div>
              <div className='collapse-item' onClick={()=>{this.props.idElement(4)}}>TextArea</div>
              
            </div>
          </Collapse>
        </li>
        <li className={isActive === 0 ? 'active nav-item' : 'nav-item'}>
          <div
            role='button'
            className='nav-link'
            data-toggle='collapse'
            onClick={this.handleCollapseNum}>
            <i className='fas fa-sort-numeric-up-alt'></i>
            <span>Entrada Númerica</span>
          </div>
          <Collapse in={this.state.isCollapseNum}>
            <div className='bg-white py-2 collapse-inner rounded'>
              <h6 className='collapse-header'>Formatos:</h6>
              <div className='collapse-item' onClick={()=>{this.props.idElement(5)}}>Entero</div>
              <div className='collapse-item' onClick={()=>{this.props.idElement(6)}}>Decimal</div>
              <div className='collapse-item'>Calculado</div>
            </div>
          </Collapse>
        </li>
        <li className={isActive === 0 ? 'active nav-item' : 'nav-item'}>
          <div
            role='button'
            className='nav-link'
            data-toggle='collapse'
            onClick={this.handleCollapseSpecial}>
            <i className='fas fa-star'></i>
            <span>Especial</span>
          </div>
          <Collapse in={this.state.isCollapseSpecial}>
            <div className='bg-white py-2 collapse-inner rounded'>
              <h6 className='collapse-header'>Formatos:</h6>
              <div className='collapse-item' onClick={()=>{this.props.idElement(7)}}>Opcion unica</div>
              <div className='collapse-item' onClick={()=>{this.props.idElement(8)}}>Opcion multiple</div>
              <div className='collapse-item' onClick={()=>{this.props.idElement(9)}}>Select</div>
              <div className='collapse-item' onClick={()=>{this.props.idElement(10)}}>Fecha</div>
              <div className='collapse-item'>Hora</div>
              <div className='collapse-item'>URL</div>
              <div className='collapse-item'>Email</div>
              <div className='collapse-item' onClick={()=>{this.props.idElement(13)}}>Matriz</div>
              <div className='collapse-item' onClick={()=>{this.props.idElement(12)}}>Imagen </div>
              <div className='collapse-item' onClick={()=>{this.props.idElement(11)}}>Adjuntar ficheros</div>
            </div>
          </Collapse>
        </li>
        <hr className='sidebar-divider'></hr>
        <div className='text-center d-none d-md-inline'>
          <button
            className='rounded-circle border-0'
            id='sidebarToggle'
            onClick={this.props.handleToogle}></button>
        </div>
      </ul>
    );
  }
}

export default withRouter(NavBarLateralQuestionary);
