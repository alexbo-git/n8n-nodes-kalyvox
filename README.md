# n8n-nodes-kalyvox

Official n8n community node for [Kalyvox](https://kalyvox.ai/en/), the AI phone receptionist for small businesses.

## Features

- Authenticate with a Kalyvox workspace API key
- Get recent call tickets
- Search call tickets
- Filter by date, status, urgency, intent and caller phone
- Use Kalyvox call data in any n8n workflow

Kalyvox call tickets can include the detected intent, urgency, caller details, call summary, transcript, appointment information and escalation metadata.

## Requirements

A Kalyvox plan with API access and a workspace API key.

Create a key in Kalyvox under:

**Settings > Integrations > Zapier**

The same public REST API is used by the official Zapier integration and this n8n node.

## Installation

### Community Nodes

In n8n, open **Settings > Community Nodes**, choose **Install**, then enter:

```
n8n-nodes-kalyvox
```

### Self-hosted development

```bash
npm install
npm run build
```

## Operations

### Call Ticket: Get Recent

Returns the newest call tickets for the authenticated Kalyvox workspace.

### Call Ticket: Search

Searches call tickets using optional filters:

- created after / before
- status
- urgency
- intent
- caller phone

## Authentication

The API key is sent as a Bearer token to the Kalyvox public API.

API base URL:

```
https://auth.kalyvox.ai/functions/v1/zapier-api
```

Credentials are workspace-scoped. The workspace is derived from the API key and cannot be selected by request parameters.

## Security

Treat the Kalyvox API key like a password. Depending on your workspace data, API responses may contain customer phone numbers and call transcripts.

Do not place API keys in workflow fields, source code or public repositories. Store them only in n8n credentials.

## Documentation

- Kalyvox: https://kalyvox.ai/en/
- Public API documentation: https://kalyvox.ai/en/help/api-kalyvox-zapier
- OpenAPI specification: https://kalyvox.ai/openapi/kalyvox-zapier-v1.json
- Kalyvox integrations: https://kalyvox.ai/en/integrations

## License

MIT © 2026 KALYVOX SASU
