import React from 'react';
import ApiUtils from './ApiUtils';
import Auth from './Auth';
import Search from './Search';
import {
  Table,
  Col,
  Button,
} from 'react-bootstrap';
import {apiUrl} from './Base';

const Record = {
  list: [],
  getRecord(cb) {
    fetch(apiUrl + '/book', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': '' + Auth.token
      }
    })
      .then(ApiUtils.checkStatus)
      .then(response => response.json()
      )
      .then(response => {
        this.list = response;
        cb();
      })
      .catch(e => {
        console.error(e);
        this.list = [];
        cb();
      });
  }
}

class ButtonInstance extends React.Component {
  constructor() {
    super();
    this.state = { show: false };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    let newShow = !this.state.show;
    this.setState({ show: newShow });
  }

  render() {
    return (
      <div>
        <Button bsStyle="link" onClick={this.toggle}>{this.props.name}</Button>
        <span>{'    '}</span>{this.state.show ? this.props.value : ''}
      </div>
    )
  }
}

class TableInstance extends React.Component {
  render() {
    const listItems = this.props.items.map((item, index) =>
      <tr><td><ButtonInstance id={item.id} name={item.name} value={item.value} /></td></tr>
    );
    return (
      <Table striped bordered condensed hover>
        <tbody>
          {listItems}
        </tbody>
      </Table>
    );
  }
}

class Protected extends React.Component {

  constructor() {
    super();
    this.state = { list: [], filteredList: [] };
    this.handleSearchTerm = this.handleSearchTerm.bind(this);
  }

  componentDidMount() {
    Record.getRecord(() => {
      this.setState({ list: Record.list, filteredList: Record.list })
    });
  }

  handleSearchTerm(terms) {
    this.setState({ filteredList: [] });
    var filtered = [];
    this.state.list.forEach((item) => {
      let found = true;
      for (var i = 0; i < terms.length; ++i) {
        if (item.name.toUpperCase().search(terms[i].toUpperCase()) < 0 &&
          item.value.toUpperCase().search(terms[i].toUpperCase()) < 0) {
          found = false;
          break;
        }
      }
      if (found) {
        filtered.push(item);
      }
    });
    this.setState({ filteredList: filtered });
  }

  render() {
    return (
      <div>
        <Col sm={12} smOffset={0} md={6} mdOffset={0}>
          <Search handleTerm={this.handleSearchTerm} />
          <p></p>
          <div>{this.props.searchComponent ? this.props.searchComponent.props.search : ''}</div>
          <TableInstance items={this.state.filteredList} />
        </Col>
      </div>);
  }
}

export default Protected;