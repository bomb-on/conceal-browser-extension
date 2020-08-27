export default class ApiHelper {
  constructor(options) {
    this.apiURL = options.state.appSettings.apiURL;
    this.auth = options.Auth;
  }

  signUpUser = (userName, email, password) => {
    const body = {
      email,
      name: userName,
      password,
    };
    return this.fetch(`${this.apiURL}/user`, { method: 'POST', body: JSON.stringify(body) })
      .then(res => Promise.resolve(res));
  };

  resetPassword = email => {
    const body = JSON.stringify({ email });
    return this.fetch(`${this.apiURL}/auth/`, { method: 'PUT', body })
      .then(res => Promise.resolve(res));
  };

  resetPasswordConfirm = (password, Token) => {
    const headers = { Token };
    const body = JSON.stringify({ password });
    return this.fetch(`${this.apiURL}/auth/`, { method: 'PATCH', headers, body })
      .then(res => Promise.resolve(res));
  };

  updateUser = ({ email, file }) => {
    const body = {};
    if (email) body.email = email;

    const options = {
      method: file ? 'POST' : 'PATCH',
      body: file || JSON.stringify(body),
    };
    if (file) options.headers = {};

    return this.fetch(`${this.apiURL}/user/${file ? 'avatar' : ''}`, options)
      .then(res => Promise.resolve(res));
  };

  getUser = () => {
    return this.fetch(`${this.apiURL}/user`, { method: 'GET' })
      .then(res => Promise.resolve(res));
  };

  addContact = (label, address, paymentID, entryID=null, edit=false) => {
    const options = {
      method: edit ? 'PATCH' : 'POST',
      body: JSON.stringify({
        entryID,
        label,
        address,
        paymentID,
      })
    };
    return this.fetch(`${this.apiURL}/address-book`, options)
      .then(res => Promise.resolve(res));
  };

  deleteContact = entryID => {
    return this.fetch(`${this.apiURL}/address-book/delete/entryID/${entryID}`, { method: 'DELETE' })
      .then(res => Promise.resolve(res));
  };

  getBlockchainHeight = () => {
    return this.fetch(`${this.apiURL}/status/height`, { method: 'GET' })
      .then(res => Promise.resolve(res));
  };

  check2FA = () => {
    return this.fetch(`${this.apiURL}/two-factor-authentication/enabled/`, { method: 'GET' })
      .then(res => Promise.resolve(res));
  };

  update2FA = (code, enable) => {
    const options = { method: enable ? 'PUT' : 'DELETE' };
    if (enable) options.body = JSON.stringify({ code });
    return this.fetch(`${this.apiURL}/two-factor-authentication${enable ? '' : `?code=${code}`}`, options)
      .then(res => Promise.resolve(res));
  };

  getQRCode = () => {
    return this.fetch(`${this.apiURL}/two-factor-authentication/`, { method: 'POST' })
      .then(res => Promise.resolve(res));
  };

  getWallets = () => {
    return this.fetch(`${this.apiURL}/wallet/unified`, { method: 'GET' })
      .then(res => Promise.resolve(res));
  };

  createWallet = () => {
    return this.fetch(`${this.apiURL}/wallet/`, { method: 'POST' })
      .then(res => Promise.resolve(res));
  };

  getWalletKeys = (address, code) => {
    return this.fetch(`${this.apiURL}/wallet/keys?address=${address}&code=${code}`, { method: 'GET' })
      .then(res => Promise.resolve(res));
  };

  importWallet = privateSpendKey => {
    const body = JSON.stringify({ privateSpendKey });
    return this.fetch(`${this.apiURL}/wallet/import`, { method: 'POST', body })
      .then(res => Promise.resolve(res));
  };

  sendTx = options => {
    const { wallet, address, paymentID, amount, message, twoFACode, password, ref, client } = options;
    let isPayment = '';
    const body = {
      amount: parseFloat(amount),
      message,
      paymentID,
      wallet,  // origin
    };
    if (address && address !== '') body.address = address;  // destination
    if (paymentID && paymentID !== '') body.paymentID = paymentID;
    if (twoFACode && twoFACode !== '') body.code = twoFACode;
    if (password && password !== '') body.password = password;
    if (client && client !== '') body.client = client;
    if (ref && ref !== '') {
      body.ref = ref;
      isPayment = '/pay';
    }
    return this
      .fetch(
        `${this.apiURL}/wallet${isPayment}`,
        {
          method: isPayment ? 'POST' : 'PUT',
          body: JSON.stringify(body),
        })
      .then(res => Promise.resolve(res));
  };

  deleteWallet = address => {
    return this.fetch(`${this.apiURL}/wallet?address=${address}`, { method: 'DELETE' })
      .then(res => Promise.resolve(res));
  };

  getId = () => {
    return this.fetch(`${this.apiURL}/id`, { method: 'GET' })
      .then(res => Promise.resolve(res));
  };

  checkId = id => {
    return this.fetch(`${this.apiURL}/id/check?id=${id}`, { method: 'GET' })
      .then(res => Promise.resolve(res));
  };

  createId = options => {
    const body = JSON.stringify(options);
    return this.fetch(`${this.apiURL}/id`, { method: 'POST', body })
      .then(res => Promise.resolve(res));
  };

  deleteId = (id, address, addressToCreate, name) => {
    const qs = `?id=${id}&address=${address}&addressToCreate=${addressToCreate}&name=${name}`;
    return this.fetch(`${this.apiURL}/id/delete${qs}`, { method: 'DELETE' })
      .then(res => Promise.resolve(res));
  };

  getMessages = () => {
    return this.fetch(`${this.apiURL}/wallet/messages`, { method: 'GET' })
      .then(res => Promise.resolve(res));
  };

  sendMessage = options => {
    const { address, message, password, sdm, twoFACode, wallet } = options;
    const body = { address, message, sdm, wallet };
    if (twoFACode && twoFACode !== '') body.code = twoFACode;
    if (password && password !== '') body.password = password;
    return this.fetch(`${this.apiURL}/wallet/send-message`, { method: 'POST', body: JSON.stringify(body) })
      .then(res => Promise.resolve(res));
  };

  getIPNConfig = address => {
    return this.fetch(`${this.apiURL}/ipn/config/?wallet=${address}`, { method: 'GET' })
      .then(res => Promise.resolve(res));
  };

  getIPNClient = client => {
    return this.fetch(`${this.apiURL}/ipn/?client=${client}`, { method: 'GET' })
      .then(res => Promise.resolve(res));
  };

  updateIPNConfig = options => {
    const {
      IPNName,
      IPNWallet,
      IPNURL,
      IPNSuccessInputURL,
      IPNFailedInputURL,
      IPNMaxRetries,
      IPNTxThreshold,
    } = options;
    const body = {
      name: IPNName,
      wallet: IPNWallet,
      ipnUrl: IPNURL,
      successIpnUrl: IPNSuccessInputURL,
      failedIpnUrl:  IPNFailedInputURL,
      maxRetries: IPNMaxRetries,
      txThreshold: IPNTxThreshold,
    };
    return this.fetch(`${this.apiURL}/ipn`, { method: 'POST', body: JSON.stringify(body) })
      .then(res => Promise.resolve(res));
  };

  getPrices = pricesURL => {
    return fetch(`${pricesURL}/simple/price?ids=conceal&vs_currencies=btc,usd&include_last_updated_at=true`)
      .then(r => r.json())
      .then(res => Promise.resolve(res));
  };

  getMarketPrices = marketApiURL => {
    return fetch(marketApiURL)
      .then(r => r.json())
      .then(res => Promise.resolve(res));
  };

  getMarketData = () => {
    return fetch('https://api.coingecko.com/api/v3/coins/conceal?sparkline=true')
      .then(r => r.json())
      .then(res => Promise.resolve(res));
  };

  fetch = (url, options) => {
    const headers = options.headers || {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (this.auth.loggedIn()) headers.token = this.auth.getToken();

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
