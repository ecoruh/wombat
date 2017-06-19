import ApiUtils from './ApiUtils';

const Auth = {
  isAuthenticated: false,
  token: {},
  message: '',
  authenticate(cb, password) {
    fetch('/api/authenticate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: password,
      })
    })
      .then(ApiUtils.checkStatus)
      .then(response => response.json()
      )
      .then(response => {
        if (response.success) {
          this.token = response.token;
        } else {
          this.token = {};
        }
        this.isAuthenticated = response.success;
        if (!response.success) {
          this.message = response.message;
        } else {
          this.message = '';
        }
        cb();
      })
      .catch(e => {
        console.error(e);
        this.isAuthenticated = false;
        this.token = {};
        this.message = '';
        cb();
      });
  },
  signout(cb) {
    this.isAuthenticated = false
    this.token = {};
    setTimeout(cb, 100)
  }
}

export default Auth;