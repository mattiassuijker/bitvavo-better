import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class Bitvavo implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Bitvavo Ticker',
        name: 'BitvavoTicker',
        icon: 'file:bitvavo.svg',
        group: ['transform'],
        version: 1,
        subtitle: 'Get ticker prices from Bitvavo',
        description: 'Get ticker prices from Bitvavo API',
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
                        name: 'Get Market Info',
                        value: 'getMarketInfo',
                        action: 'Get Market Info',
                        description: 'Get information about the specified market',
                        routing: {
                            request: {
                                method: 'GET',
                                url: 'ticker/price',
                                qs: {
                                    market: 'BTC-EUR',
                                    // Add any other necessary parameters
                                },
                            },
                        },
                    },
                ],
                default: 'getMarketInfo',
            },
        ],
    };
}