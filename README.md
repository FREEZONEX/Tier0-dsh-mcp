# Tier0 for DeepSeek Harness

Connect DSH to a Tier0 workspace using the official DSH MCP client. The connector discovers the tools exposed by the connected server, including `whoami`, `docs`, `search` and `execute` on the Tier0 Cloud MCP service.

连接 DSH 与 Tier0 工作空间，通过当前账号权限查询工业数据、查看数据源状态和管理资源。

## Requirements

- DSH `0.2.2-rc.1` and Node.js `24.9.0` or newer.
- A reachable Tier0 Cloud instance with its `/mcp` endpoint enabled.
- A personal API key created in that instance. The key determines the workspace and access rights.

## Install

```sh
dsh plugin --profile web add @tier0/dsh-mcp
```

Replace `web` with the name of an existing profile to install there. Restart DSH after installation.

The default endpoint is `https://dev.tier0.cn/mcp`, Tier0's development environment. Configure your own instance before providing its key. In the Tier0 plugin settings, set `url` to the complete HTTPS MCP endpoint. `apiKeyEnv` defaults to `TIER0_API_KEY`; `toolCallTimeoutMs` defaults to `120000`.

默认地址为 Tier0 开发环境。连接其他实例时，先在 Tier0 插件设置中填写完整 MCP 地址，例如 `https://your-tier0.example/mcp`，再使用该实例的个人 API Key。

## Credentials

The plugin reads the API key from the DSH process environment at activation. Enter the key value alone. Set it in the terminal used to launch DSH.

PowerShell 7

```powershell
$env:TIER0_API_KEY = Read-Host 'Tier0 personal API key' -MaskInput
dsh --profile web
```

Bash

```bash
read -rs -p 'Tier0 personal API key: ' TIER0_API_KEY
export TIER0_API_KEY
printf '\n'
dsh --profile web
```

These examples retain the key for the current terminal session. Restart DSH after changing the key. Credential rotation and revocation are managed in Tier0.

## Use

Ask DSH to call `mcp__tier0__whoami` and report the connected workspace. Then try “List the collections I can access” or “Inspect my data sources and summarize their status”.

先确认当前工作空间，再查询集合或数据源。模型通过 `docs` 获取概念指引，通过 `search` 查找当前可用接口，再用 `execute` 调用。实际能力取决于服务端和当前账号权限。

HTTP 401 requires a valid key for the configured instance. HTTP 403 indicates insufficient access. A missing `TIER0_API_KEY` prevents this plugin from connecting and produces a setup message. TLS certificates must be trusted by Node.js. Tool errors are returned to DSH by the official MCP client.

## Development

```sh
npm ci
npm test
npm pack
```

The package uses the host's `@deepseek-ai/dsh-mcp-client` peer dependency and ships a Cordis bundle patch, English and Chinese metadata, and the Tier0 icon. The supported DSH version is pinned to the validated release.

Validation on Windows with DSH `0.2.2-rc.1` included installation of the packed archive into a fresh Web profile, full DSH startup, discovery of the four Tier0 tools, and a successful read-only `whoami` call. The npm test suite checks invalid endpoints, missing credentials and accidental Bearer prefixes. Visual rendering of the settings page remains unverified.

License: MIT. Copyright 2026 FREEZONEX.
