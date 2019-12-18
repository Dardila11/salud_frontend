import React, { Component } from 'react';

import Autosuggest from 'react-autosuggest';

const getSuggestionValue = suggestion => suggestion;

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSectionSuggestions(section) {
  return section.userName;
}

// Renderiza el titulo y el contenido del objeto Usuario
function renderSectionTitle(section) {
  return <strong>{section.userEmail}</strong>;
}

function renderSuggestion(suggestion) {
  return <span>{suggestion}</span>;
}

export default class AutosuggestUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange = (_, { newValue }) => {
    const { id, onChange } = this.props;

    this.setState({
      value: newValue
    });

    onChange(id, newValue);
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionSelected = (event, { suggestion, method }) => {
    if (method === 'enter') {
      event.preventDefault();
    }
    //Se usa expresiones regulares para extraer el id del usuario del formato nombre [id]
    var regExp = /\[([^)]+)\]/;
    var matches = regExp.exec(suggestion);
    console.log(matches[1]);
    this.props.setFieldValue(this.props.name, parseInt(matches[1]));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  // Teach Autosuggest how to calculate suggestions for any given input value.
  getSuggestions = value => {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    const users = this.props.users;

    //Se formatea de tal manera que sea reconocible para la libreria autosuggest
    return users
      .map(section => {
        return {
          userId: section.userId,
          userEmail: section.userEmail,
          userName: [
            section.userName + ' [' + section.userId + ']'
          ].filter(value => regex.test(value))
        };
      })
      .filter(section => section.userName.length > 0);
  };

  render() {
    const { id, placeholder, name } = this.props;
    const { suggestions, value } = this.state;
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      name: name,
      required: true,
      value,
      placeholder: placeholder,
      onChange: this.onChange,
      valid: this.props.isValid ? 1 : 0,
      invalid: this.props.isInvalid ? 1 : 0
    };

    return (
      <Autosuggest
        id={id}
        multiSection={true}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderSectionTitle={renderSectionTitle}
        getSectionSuggestions={getSectionSuggestions}
        inputProps={inputProps}
      />
    );
  }
}
