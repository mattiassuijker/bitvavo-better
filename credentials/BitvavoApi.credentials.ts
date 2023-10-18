import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class BitvavoApi implements ICredentialType {
    name = 'BitvavoApi';
    displayName = 'Bitvavo API';
    documentationUrl = 'https://docs.bitvavo.com/';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            default: '',
        },
        {
            displayName: 'API Secret',
            name: 'apiSecret',
            type: 'string',
            default: '',
        },
    ];
}