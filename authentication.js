'use strict';

const { authenticate } = require('./util');
const test = async (z, bundle) => {
  let data = await authenticate(z, bundle);
  data.hostUser = `${bundle.authData.username}@${bundle.authData.gatewayUrl}`;
  return data;
}

// This function runs after every outbound request. You can use it to check for
// errors or modify the response. You can have as many as you need. They'll need
// to each be registered in your index.js file.
const handleBadResponses = (response, z, bundle) => {
  if (response.status === 401) {
    throw new z.errors.Error(
        // This message is surfaced to the user
        'Invalid credentials',
        'AuthenticationError',
        response.status
    );
  }
  if (response.status >= 500) {
    throw new z.errors.Error(
        // This message is surfaced to the user
        response.data.message,
        'RequestError',
        response.status
    );
  }

  return response;
};


module.exports = {
  config: {
    type: 'custom',

    fields: [
      { key: 'gatewayUrl', label: 'REST Gateway URL', required: true, helpText: 'Specify the domain of the REST gateway (eg https://aws-us-east-1.restgw.cloud.memphis.dev/)'},
      { key: 'username', label: 'Client Type Username', required: true },
      { key: 'accountId', label: 'Account ID', required: true, type: 'integer'},
      { key: 'password', label: 'Password', required: true, type: 'password' },
    ],

    test,

    connectionLabel: '{{hostUser}}',
  },
  befores: [],
  afters: [handleBadResponses],
};
