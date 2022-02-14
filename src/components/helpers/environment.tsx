let APIURL:string = '';

switch (window.location.hostname) {
  case 'localhost' || '127.0.0.1':
    // APIURL = 'https://mealprepmarket-server.herokuapp.com';
    APIURL = 'http://localhost:3001'
    break;
  case 'https://mealprepmarket.herokuapp.com':
    APIURL = 'https://mealprepmarket-server.herokuapp.com'
}

export default APIURL;