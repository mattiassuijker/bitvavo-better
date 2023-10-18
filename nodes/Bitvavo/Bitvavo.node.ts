import {
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    ICredentialDataDecryptedObject,
} from 'n8n-workflow';

export class Bitvavo implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Bitvavo Ticker',
        name: 'BitvavoTicker',
        icon: 'file:bitvavo.svg',
        group: ['transform'],
        version: 1,
        subtitle: 'Get ticker prices from Bitvavo',
        description: 'Get ticker prices from Bitvavo API without specific parameters',
        defaults: {
            name: 'Bitvavo Ticker',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'BitvavoApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: 'https://api.bitvavo.com/v2/',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Ticker Price',
                        value: 'tickerPrice',
                    },
                ],
                default: 'tickerPrice',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Get Ticker Price',
                        value: 'getTickerPrice',
                        action: 'Get Ticker Price',
                        description: 'Get the ticker prices without specific parameters',
                        routing: {
                            request: {
                                method: 'GET',
                                url: 'ticker/price',
                                // No qs property for this operation
                            },
                        },
                    },
                ],
                default: 'getTickerPrice',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<any> {
        const credentials = await this.getCredentials('BitvavoApi') as ICredentialDataDecryptedObject;
    
        if (!credentials) {
            throw new Error('Credentials not set!');
        }
    
        try {
            // Make the API request
            const responseData = await this.helpers.request({
                method: 'GET',
                uri: 'https://api.bitvavo.com/v2/ticker/price',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                auth: {
                    user: credentials.apiKey as string,
                    pass: credentials.apiSecret as string,
                },
                port: 443, // Set the port explicitly to 443 (assuming HTTPS)
            });
    
            // Ensure that the responseData is in the expected format
            if (!Array.isArray(responseData)) {
                throw new Error('API response is not an array. Check the API documentation.');
            }
    
            // Return the response data
            return this.helpers.returnJsonArray(responseData);
        } catch (error) {
            throw new Error(`Error making API request: ${error.message}`);
        }
    }
}