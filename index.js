import Schema from '@deepseek-ai/schemastery';
import * as mcpClient from '@deepseek-ai/dsh-mcp-client';

export const name = 'tier0-mcp';
export const inject = ['tools'];

export const Config = Schema.object({
  url: Schema.string().default('https://dev.mcp.tier0.cn/mcp'),
  apiKeyEnv: Schema.string().default('TIER0_API_KEY'),
  toolCallTimeoutMs: Schema.number().min(1000).max(300000).default(120000),
});

export async function apply(ctx, config) {
  let endpoint;
  try {
    endpoint = new URL(config.url);
  } catch {
    throw new Error('Tier0 MCP URL must be an absolute HTTPS URL, for example https://dev.mcp.tier0.cn/mcp.');
  }
  if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.hash) {
    throw new Error('Tier0 MCP URL must use HTTPS and omit embedded credentials and fragments.');
  }

  const apiKey = process.env[config.apiKeyEnv]?.trim();
  if (!apiKey) {
    throw new Error(`Set ${config.apiKeyEnv} to a personal API key from the configured Tier0 instance, then restart DSH.`);
  }
  if (/\s/.test(apiKey)) {
    throw new Error(`Set ${config.apiKeyEnv} to the API key value only, without the Bearer prefix or whitespace.`);
  }

  await mcpClient.apply(ctx, {
    serverName: 'tier0',
    transport: 'streamable-http',
    url: endpoint.href,
    headers: { Authorization: `Bearer ${apiKey}` },
    toolCallTimeoutMs: config.toolCallTimeoutMs,
    failOnStartupError: true,
  });
}
