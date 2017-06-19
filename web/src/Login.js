import React from 'react'
import {
  Redirect,
} from 'react-router-dom'
import {
  Button,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  InputGroup,
  Glyphicon,
  Col
} from 'react-bootstrap';
import ApiUtils from './ApiUtils';
import Auth from './Auth';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
      value: '',
      clear: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.clearEntry = this.clearEntry.bind(this);
  }

  getValidationState() {
    const length = this.state.value.length;
    if (length > 3) return 'success';
    else if (length > 0) return 'error';
  }

  login(event) {
    const auth = Auth.authenticate(() => {
      this.setState({ redirectToReferrer: true, clear: true })
    }, this.state.value);
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({ value: event.target.value, clear: true });
  }

  clearEntry() {
    this.setState({ value: '', clear: true });
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    var { message } = this.state.clear ? { message: '' } : this.props.location.state || { message: '' };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return (
        <Redirect to={from} />
      )
    }

    return (
      <div>
        <Col sm={12} smOffset={0} md={6} mdOffset={0}>
          <Form onSubmit={this.login}>
            <FormGroup
              controlId="formBasicText"
              validationState={this.getValidationState()}
            >
              <ControlLabel>Enter login password</ControlLabel>
              <InputGroup>
                <FormControl
                  type="password"
                  value={this.state.value}
                  placeholder="Enter password"
                  onChange={this.handleChange}
                />
                <InputGroup.Button>
                  <Button onClick={this.clearEntry}><Glyphicon glyph="remove-sign" /></Button>
                </InputGroup.Button>
              </InputGroup>
              <HelpBlock>{message}</HelpBlock>
            </FormGroup>
            <Button type="submit">Log in</Button>
          </Form>
        </Col>
      </div>
    )
  }
}
export default Login;