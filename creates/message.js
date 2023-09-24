const { refreshToken, sanitizeUrl, uuidv4 } = require('../util');
// create a particular message by name
const perform = async (z, bundle) => {
  const auth = await refreshToken(z, bundle);
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${auth.jwt}`
  }

  const response = await z.request({
    method: 'POST',
    url: `${sanitizeUrl(bundle.authData.gatewayUrl)}/stations/${bundle.inputData.station}/produce/single`,
    headers,
    // if `body` is an object, it'll automatically get run through JSON.stringify
    // if you don't want to send JSON, pass a string in your chosen format here instead
    body: {
      message: bundle.inputData.message
    }
  });

  // this should return a single object
  let data = response.data;
  if (data.success) {
    return { message: bundle.inputData.message, id: uuidv4() }
  }
  throw new z.errors.Error(
      // This message is surfaced to the user
      data.error,
      'CreateError',
      response.status
  );
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#createschema
  key: 'message',
  noun: 'Message',

  display: {
    label: 'Produce a Message',
    description: 'Produces a new message to the specified station, probably with input from previous steps.'
  },

  operation: {
    perform,

    // `inputFields` defines the fields a user could provide
    // Zapier will pass them in as `bundle.inputData` later. They're optional.
    // End-users will map data into these fields. In general, they should have any fields that the API can accept. Be sure to accurately mark which fields are required!
    inputFields: [
      {key: 'station', label: 'Station', required: true},
      {key: 'message', label: 'Message', required: true, type: 'text'},
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
