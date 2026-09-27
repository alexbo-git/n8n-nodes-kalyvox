import type {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

const BASE_URL = 'https://auth.kalyvox.ai/functions/v1/zapier-api';

export class Kalyvox implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Kalyvox',
    name: 'kalyvox',
    icon: {
      light: 'file:kalyvox.svg',
      dark: 'file:kalyvox.svg',
    },
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Work with Kalyvox call tickets',
    defaults: { name: 'Kalyvox' },
    usableAsTool: true,
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [{ name: 'kalyvoxApi', required: true }],
    requestDefaults: {
      baseURL: BASE_URL,
      headers: { Accept: 'application/json' },
    },
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [{ name: 'Call Ticket', value: 'ticket' }],
        default: 'ticket',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['ticket'] } },
        options: [
          {
            name: 'Get Recent',
            value: 'getRecent',
            action: 'Get recent call tickets',
            description: 'Get the newest call tickets',
          },
          {
            name: 'Search',
            value: 'search',
            action: 'Search call tickets',
            description: 'Search and filter call tickets',
          },
        ],
        default: 'getRecent',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1, maxValue: 100 },
        displayOptions: {
          show: { resource: ['ticket'], operation: ['getRecent', 'search'] },
        },
        description: 'Max number of results to return',
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: { resource: ['ticket'], operation: ['search'] },
        },
        options: [
          {
            displayName: 'Caller Phone',
            name: 'callerPhone',
            type: 'string',
            default: '',
            description: 'Exact caller number in E.164 format',
          },
          {
            displayName: 'Created After',
            name: 'createdAfter',
            type: 'dateTime',
            default: '',
          },
          {
            displayName: 'Created Before',
            name: 'createdBefore',
            type: 'dateTime',
            default: '',
          },
          {
            displayName: 'Intent',
            name: 'intent',
            type: 'string',
            default: '',
            description: 'Intent key configured in Kalyvox',
          },
          {
            displayName: 'Status',
            name: 'status',
            type: 'options',
            default: '',
            options: [
              { name: 'Any', value: '' },
              { name: 'Closed', value: 'closed' },
              { name: 'In Progress', value: 'in_progress' },
              { name: 'Open', value: 'open' },
              { name: 'Pending', value: 'pending' },
              { name: 'Resolved', value: 'resolved' },
            ],
          },
          {
            displayName: 'Urgency',
            name: 'urgency',
            type: 'options',
            default: '',
            options: [
              { name: 'Any', value: '' },
              { name: 'High', value: 'high' },
              { name: 'Normal', value: 'normal' },
            ],
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;
      const limit = this.getNodeParameter('limit', i, 50) as number;
      let options: IHttpRequestOptions;

      if (operation === 'getRecent') {
        options = {
          method: 'GET',
          url: `${BASE_URL}/v1/tickets/recent`,
          qs: { limit },
          json: true,
        };
        const response = await this.helpers.httpRequestWithAuthentication.call(
          this,
          'kalyvoxApi',
          options,
        );
        const tickets = Array.isArray(response) ? response : [];
        for (const ticket of tickets) {
          returnData.push({
            json: ticket as IDataObject,
            pairedItem: { item: i },
          });
        }
        continue;
      }

      const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
      const qs: IDataObject = { limit };
      if (filters.createdAfter) qs.created_after = filters.createdAfter;
      if (filters.createdBefore) qs.created_before = filters.createdBefore;
      if (filters.status) qs.status = filters.status;
      if (filters.urgency) qs.urgency = filters.urgency;
      if (filters.intent) qs.intent = filters.intent;
      if (filters.callerPhone) qs.caller_phone = filters.callerPhone;

      options = {
        method: 'GET',
        url: `${BASE_URL}/v1/tickets/search`,
        qs,
        json: true,
      };
      const response = (await this.helpers.httpRequestWithAuthentication.call(
        this,
        'kalyvoxApi',
        options,
      )) as { results?: IDataObject[] };

      for (const ticket of response.results ?? []) {
        returnData.push({
          json: ticket,
          pairedItem: { item: i },
        });
      }
    }
    return [returnData];
  }
}
