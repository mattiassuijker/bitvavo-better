import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    ICredentialDataDecryptedObject,
} from 'n8n-workflow';
import axios from 'axios';
import * as crypto from 'crypto';

export class Bitvavo implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Bitvavo Ticker',
        name: 'BitvavoTicker',
        icon: 'file:bitvavo.svg',
        group: ['transform'],
        version: 1,
        subtitle: 'Get ticker prices from Bitvavo',
        description: 'Get ticker prices from Bitvavo API with specific parameters',
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
                        description: 'Get the ticker prices with specific parameters',
                        routing: {
                            request: {
                                method: 'GET',
                                url: 'ticker/price',
                            },
                        },
                    },
                    {
                        name: 'Place Order',
                        value: 'placeOrder',
                        action: 'Place Order',
                        description: 'Place a new order',
                        routing: {
                            request: {
                                method: 'POST',
                                url: 'order',
                            },
                        },
                    },
                ],
                default: 'getTickerPrice',
            },
            {
                displayName: 'Order Type',
                name: 'orderType',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Market',
                        value: 'market',
                    },
                    {
                        name: 'Limit',
                        value: 'limit',
                    },
                ],
                displayOptions: {
                    show: {
                        operation: ['placeOrder'],
                    },
                },
                default: 'market',
            },
            {
                displayName: 'Amount',
                name: 'amount',
                type: 'number',
                displayOptions: {
                    show: {
                        operation: ['placeOrder'],
                    },
                },
                default: 1,
                description: 'Enter the amount for the order.',
            },
            {
                displayName: 'Price',
                name: 'price',
                type: 'number',
                displayOptions: {
                    show: {
                        operation: ['placeOrder'],
                        orderType: ['limit'],
                    },
                },
                default: 0,
                description: 'Enter the price for the limit order.',
            },
            {
                displayName: 'Symbol',
                name: 'symbol',
                type: 'string',
                default: '',
                description: 'Enter the ticker symbol for the specific price you want to retrieve or place an order.',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const credentials = await this.getCredentials('BitvavoApi') as ICredentialDataDecryptedObject;

        if (!credentials) {
            throw new Error('Credentials not set!');
        }

        const symbol = this.getNodeParameter('symbol', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        try {
            let url = '';
            let method = 'GET';
            let data = {};

            if (operation === 'getTickerPrice') {
                url = 'ticker/price';
            } else if (operation === 'placeOrder') {
                url = 'order';
                method = 'POST';

                const orderType = this.getNodeParameter('orderType', 0) as string;
                const amount = this.getNodeParameter('amount', 0) as number;
                const price = this.getNodeParameter('price', 0) as number;

                data = {
                    market: symbol || '',
                    side: 'buy', // You may want to make 'side' dynamic based on user input
                    orderType,
                    amount,
                    ...(orderType === 'limit' && { price }),
                };
            }

            // Generate timestamp and signature
            const timestamp = Date.now().toString();
            const signature = crypto
                .createHmac('sha256', credentials.apiSecret as string)
                .update(timestamp)
                .digest('hex');

            // Make the API request using axios
            const response = await axios({
                method,
                url,
                data,
                params: {
                    market: symbol || '',
                },
                headers: {
                    'X-Bitvavo-Access-Key': credentials.apiKey as string,
                    'X-Bitvavo-Access-Signature': signature,
                    'X-Bitvavo-Access-Timestamp': timestamp,
                    'Content-Type': 'application/json',
                },
            });

            // Extract the data from the response
            const parsedData = response.data;

            // Wrap the parsed data in an array
            const outputData: INodeExecutionData[] = [{ json: parsedData }];

            // Return the array
            return [outputData];
        } catch (error) {
            // Log more information about the error
            console.error('Error making API request:', error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
            }

            // Rethrow the error
            throw new Error(`Error making API request: ${error.message}`);
        }
    }
}