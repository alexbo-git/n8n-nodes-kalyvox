import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class KalyvoxApi implements ICredentialType {
  name = 'kalyvoxApi';
  displayName = 'Kalyvox API';
  documentationUrl = 'https://kalyvox.ai/en/help/api-kalyvox-zapier';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description:
        'Workspace API key generated in Kalyvox under Settings > Integrations > Zapier.',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://auth.kalyvox.ai/functions/v1/zapier-api',
      url: '/v1/auth/test',
      method: 'GET',
    },
  };
}
