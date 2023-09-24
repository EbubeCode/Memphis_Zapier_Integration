const { refreshToken, sanitizeUrl, uuidv4} = require('../util');

// triggers on a new message with a certain tag
const perform = async (z, bundle) => {
  const auth = await refreshToken(z, bundle);
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${auth.jwt}`
  }
  const body = {
    'consumer_name': bundle.inputData.consumer || bundle.authData.username,
    'consumer_group': bundle.inputData.consumerGroup || 'zapier',
    'batch_size': parseInt(bundle.inputData.batchSize || '10')
  }
  const response = await z.request({
    method: 'POST',
    url: `${sanitizeUrl(bundle.authData.gatewayUrl)}/stations/${bundle.inputData.station}/consume/batch`,
    headers,
    body
  });
  // this should return an array of objects
  return response.data.map((message) => {
    return {
      ...message,
      id: uuidv4()
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
    description: 'Triggers when a new message is published to a station.'
  },

  operation: {
    perform,

    // `inputFields` defines the fields a user could provide
    // Zapier will pass them in as `bundle.inputData` later. They're optional.
    inputFields: [
      {key: 'station', label: 'Station', required: true},
      {
        key: 'consumer',
        label: 'Consumer Name',
        required: false,
        helpText: 'A consumer is the client that reads/consumes messages from a Memphis station.'
      },
      {
        key: 'consumerGroup',
        label: 'Consumer Group Name',
        required: false,
        helpText: 'A consumer group is a collection of multiple consumers. Read more [here](https://docs.memphis.dev/memphis/memphis-broker/concepts/consumer-groups).'
      },
      {
        key: 'batchSize',
        label: 'Batch size',
        required: false,
        type: 'integer',
        helpText: 'Amount of messages this zap can fetch at once.'
      },
    ],

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      message: "Hello world",
      headers: {
        "Content-Type": "application/json",
        "Host": "localhost:4444"
      },
      id: '486ca60b-8c2c-411e-b54e-67c74a4fb925'
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
