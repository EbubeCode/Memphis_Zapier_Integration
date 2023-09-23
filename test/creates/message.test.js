const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe('creates.message', () => {
  it('should run', async () => {
    const bundle = {
      authData: {
        gatewayUrl: 'http://localhost:4444',
        username: 'ebube',
        password: '2242H-@C3-1%@xF@@W'
      },
      inputData: {
        station: 'ebubeagu',
        message: 'Hello world'
      }
    };

    const results = await appTester(App.creates.message.operation.perform, bundle);
    expect(results).toBeDefined();
    // TODO: add more assertions
  });
});
