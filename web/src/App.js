import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';
import {
  Navbar,
  NavItem,
  Nav,
} from 'react-bootstrap';
import Auth from './Auth';
import Login from './Login';
import Protected from './Protected';

const App = () => (
  <Router>
    <div className="container">
      <Navbar inverse>
        <Navbar.Brand>
          <a href="#"><img src="react.svg" height="24" width="24" alt="Home Data Centre" /></a>
        </Navbar.Brand>
        <Nav pullLeft>
          <LoginItem />
          <LogoutItem />
        </Nav>
      </Navbar>
      <Route path="/login" component={Login} />
      <PrivateRoute path="/protected" component={Protected} />
    </div>
  </Router>
)

const LoginItem = withRouter(({ history }) => (
  !Auth.isAuthenticated ? (
    <NavItem eventKey={1} href="/protected">Login
    </NavItem>
  ) : (
      <div></div>
    )
))

const LogoutItem = withRouter(({ history }) => (
  Auth.isAuthenticated ? (
    <NavItem eventKey={1} onClick={() => {
      Auth.signout(() => history.push('/'))
    }}>Logout
    </NavItem>
  ) : (
      <div></div>
    )
))

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    Auth.isAuthenticated ? (
      <Component {...props} />
    ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location, message: Auth.message }
        }} />
      )
  )} />
)

export default App;