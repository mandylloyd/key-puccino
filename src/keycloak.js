import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'key-puccino',
  clientId: 'key-puccino',
});

export default keycloak;