import assert from 'node:assert/strict';
import test from 'node:test';
import { apply } from '../index.js';

const config = {
  url: 'https://dev.tier0.cn/mcp',
  apiKeyEnv: 'TIER0_DSH_TEST_KEY',
  toolCallTimeoutMs: 120000,
};

test('rejects malformed or credential-bearing endpoints before connecting', async () => {
  for (const url of ['dev.tier0.cn/mcp', 'http://dev.tier0.cn/mcp', 'https://user:secret@example.com/mcp', 'https://example.com/mcp#token']) {
    await assert.rejects(apply({}, { ...config, url }), /Tier0 MCP URL/);
  }
});

test('missing credentials give an actionable error without connecting', async () => {
  await assert.rejects(apply({}, { ...config, apiKeyEnv: 'TIER0_DSH_MISSING_TEST_KEY_20261110' }), /Set TIER0_DSH_MISSING_TEST_KEY_20261110/);
});

test('rejects a pasted Bearer prefix without disclosing the key', async () => {
  const previous = process.env.TIER0_DSH_TEST_KEY;
  process.env.TIER0_DSH_TEST_KEY = 'Bearer fixture-secret';
  try {
    await assert.rejects(apply({}, config), (error) => {
      assert.match(error.message, /key value only/);
      assert(!error.message.includes('fixture-secret'));
      return true;
    });
  } finally {
    if (previous === undefined) delete process.env.TIER0_DSH_TEST_KEY;
    else process.env.TIER0_DSH_TEST_KEY = previous;
  }
});
