import { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';

export class BitvavoApi implements ICredentialType {
  name = 'BitvavoApi';
  displayName = 'Bitvavo API';
  documentationUrl = 'https://docs.bitvavo.com/'; // Add a default value here
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      default: '',
    },
    // Add more properties if needed
  ];
  authenticate = {
    type: 'generic',
    properties: {
      qs: {
        'apikey': '={{ $credentials.apiKey }}',
      },
    },
  } as IAuthenticateGeneric;
}


