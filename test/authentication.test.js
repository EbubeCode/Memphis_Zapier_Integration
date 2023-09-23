/* globals describe, it, expect */

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('custom auth', () => {
  it('passes authentication and returns json', async () => {
    const bundle = {
      authData: {
        gatewayUrl: 'http://localhost:4444',
        username: 'ebube',
        password: '2242H-@C3-1%@xF@@W'
      },
    };

    const response = await appTester(App.authentication.test, bundle);
    expect(response).toHaveProperty('hostUser');
  });

  it('fails on bad auth', async () => {
    const bundle = {
      authData: {
        gatewayUrl: 'http://localhost:4444',
        username: 'ebube',
        password: 'f-@C3-1%@xF@@W'
      },
    };

    try {
      await appTester(App.authentication.test, bundle);
    } catch (error) {
      expect(error.message).toContain('Invalid credentials');
      return;
    }
    throw new Error('appTester should have thrown');
  });
});
