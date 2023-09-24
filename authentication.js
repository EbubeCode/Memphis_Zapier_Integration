'use strict';

const { authenticate } = require('./util');

const test = async (z, bundle) => {
  let data = await authenticate(z, bundle);
  data.hostUser = `${bundle.authData.username}@${getShortUrl(bundle.authData.gatewayUrl)}`;
  return data;
}

const getShortUrl = (url) => {
    const regionRegex = /https?:\/\/([^\/:]+).*$/;
    const match = url.match(regionRegex);
    if (match && match[1]) {
      return match[1].split(':')[0].split('.')[0];
    }
    return '';
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
      {
        key: 'gatewayUrl', label: 'Memphis REST Gateway URL',
        required: true,
        helpText: 'Specify the domain of your Memphis.dev REST gateway (For example https://[cloud-provider].[region].restgw.cloud.memphis.dev). Learn more [here](https://docs.memphis.dev/memphis/integrations-center/other-platforms/zapier).'
      },
      { key: 'username', label: 'Client-type Username', required: true },
      { key: 'password', label: 'Client-type Password', required: true, type: 'password' },
      {
        key: 'accountId',
        label: 'Account ID',
        required: false,
        type: 'integer',
        helpText: 'In case you are a Memphis.dev Cloud user, please specify your “Account ID.” (e.g., 212111333). Learn more [here](https://docs.memphis.dev/memphis/integrations-center/other-platforms/zapier).'
      },
    ],

    test,

    connectionLabel: '{{hostUser}}',
  },
  befores: [],
  afters: [handleBadResponses],
};
