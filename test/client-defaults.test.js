import assert from 'node:assert/strict';
import { mock, test } from 'node:test';
import * as client from '@deepseek-ai/dsh-mcp-client';

let received;
mock.module('@deepseek-ai/dsh-mcp-client', {
  namedExports: { ...client, apply: async (_ctx, config) => { received = config; } },
});
const { apply } = await import('../index.js');

test('passes the host client defaults and caller options to the connection', async () => {
  const envName = 'TIER0_DSH_DEFAULTS_TEST_KEY';
  const previous = process.env[envName];
  process.env[envName] = 'fixture-key';
  try {
    await apply({}, {
      url: 'https://custom.example/mcp', apiKeyEnv: envName, toolCallTimeoutMs: 45000,
    });
    // Regression: bypassing Config left rc.3 cleanup with an undefined timer budget.
    assert.equal(received.closeTimeoutMs, 5000);
    assert.equal(received.maxInstructionBytes, 32768);
    assert.equal(received.reconnect.enabled, true);
    assert.equal(received.toolCallTimeoutMs, 45000);
    assert.equal(received.url, 'https://custom.example/mcp');
    assert.equal(received.headers.Authorization, 'Bearer fixture-key');
    assert.equal(received.failOnStartupError, true);
  } finally {
    if (previous === undefined) delete process.env[envName];
    else process.env[envName] = previous;
  }
});
