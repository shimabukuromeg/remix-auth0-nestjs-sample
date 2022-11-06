import { createClient } from 'urql';
import type { Client } from 'urql';

export function urqlClient(accessToken?: string): Promise<Client> {
    return new Promise((resolve, reject) => {
        const client = createClient({
            url: process.env.NEXT_PUBLIC_BASE_URL || '',
            fetchOptions: () => {
                return {
                    headers: {
                        authorization: accessToken ? `Bearer ${accessToken}` : '',
                    },
                };
            },
        });
        if (!client) {
            reject(Error('Failed to init initUrqlClient.'));
        } else {
            resolve(client);
        }
    });
}