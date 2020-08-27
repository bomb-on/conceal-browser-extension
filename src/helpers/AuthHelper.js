import decode from 'jwt-decode';


export default class AuthHelper {
  constructor(domain) {
    this.domain = process.env.REACT_APP_API_ENDPOINT;
  }

  login = (email, password, twoFACode) => {
    const body = {
      email,
      password,
      rememberme: false,
    };
    if (twoFACode && twoFACode !== '') body.code = twoFACode;
    return this.fetch(`${this.domain}/auth`, { method: 'POST', body: JSON.stringify(body) })
      .then(res => {
        if (res.message.token) this.setToken(res.message.token);
        return Promise.resolve(res);
      });
  };

  loggedIn = () => {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  };

  isTokenExpired = token => {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  };

  setToken = idToken => localStorage.setItem('id_token', idToken);

  getToken = () => (localStorage.getItem('id_token'));

  logout = () => localStorage.removeItem('id_token');

  decodeToken = () => (decode(this.getToken()));

  fetch = (url, options) => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
    if (this.loggedIn()) {
      headers['Authorization'] = `Bearer ${this.getToken()}`;
    }

    return fetch(url, { headers, ...options })
      .then(this._checkStatus)
      .then(response => response.json());
  };

  _checkStatus = response => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  };
}
