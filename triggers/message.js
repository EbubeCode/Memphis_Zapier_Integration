const { refreshToken, sanitizeUrl } = require('../util');

// triggers on a new message with a certain tag
const perform = async (z, bundle) => {
  const auth = await refreshToken(z, bundle);
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${auth.jwt}`
  }
  const body = {
    'consumer_name': bundle.inputData.consumer || bundle.authData.username,
    'consumer_group': bundle.inputData.consumerGroup || 'zapier'
  }
  const response = await z.request({
    method: 'POST',
    url: `${sanitizeUrl(bundle.authData.gatewayUrl)}/stations/${bundle.inputData.station}/consume/batch`,
    headers,
    body
  });
  // this should return an array of objects
  let id = 0;
  return response.data.map((message) => {
    return {
      ...message,
      id: ++id
    }
  });
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#triggerschema
  key: 'message',
  noun: 'Message',

  display: {
    label: 'New Message',
    description: 'Triggers when a new message published to station.'
  },

  operation: {
    perform,

    // `inputFields` defines the fields a user could provide
    // Zapier will pass them in as `bundle.inputData` later. They're optional.
    inputFields: [
      {key: 'station', label: 'Station', required: true},
      {key: 'consumer', label: 'Consumer Name', required: false},
      {key: 'consumerGroup', label: 'Consumer Group Name', required: false},
    ],

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      message: "Hello world",
      headers: {
        "Content-Type": "application/json",
        "Host": "localhost:4444"
      }
    },

    // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
    // For a more complete example of using dynamic fields see
    // https://github.com/zapier/zapier-platform/tree/main/packages/cli#customdynamic-fields
    // Alternatively, a static field definition can be provided, to specify labels for the fields
    outputFields: [
      // these are placeholders to match the example `perform` above
      // {key: 'id', label: 'Person ID'},
      // {key: 'name', label: 'Person Name'}
    ]
  }
};
