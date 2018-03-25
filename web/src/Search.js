import React from 'react'
import {
  Button,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  InputGroup,
  Glyphicon,
} from 'react-bootstrap';

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      term: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.clearEntry = this.clearEntry.bind(this);
  }

  getValidationState() {
    const length = this.state.term.length;
    if (length > 3) return 'success';
    else if (length > 0) return 'error';
  }

  handleSubmit(event) {
    event.preventDefault();
  }


  handleChange(event) {
    var term = event.target.value;
    this.setState({ term: term });
    var terms = term.trim().split(/[\s]+/);
    var filter = function (value, index) { return this.indexOf(value) == index };
    var filteredData = terms.filter(filter, terms);
    this.props.handleTerm(filteredData);
  }

  clearEntry() {
    this.setState({ term: '' });
    this.props.handleTerm([""]);
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
            <FormGroup
              controlId="formBasicText"
              validationState={this.getValidationState()}
            >
              <InputGroup>
                <FormControl
                  type="search"
                  value={this.state.term}
                  placeholder="Search..."
                  onChange={this.handleChange}
                  autoCorrect="off" 
                  autoCapitalize="none"
                />
                <InputGroup.Button>
                  <Button onClick={this.clearEntry}><Glyphicon glyph="remove-circle" /></Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
            {' '}
        </Form>
      </div>
    )
  }
}
export default Search;