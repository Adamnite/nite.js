/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

import { decode, encode } from '@msgpack/msgpack';

import { Provider } from './provider';

export class HttpProvider implements Provider {
  /**
   * URL to send the RPC calls to.
   */
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  /**
   * Send RPC calls over HTTP.
   *
   * @param method RPC method to be called
   * @param params Parameters to send to the RPC method
   * @returns Promise
   */
  send<T>(method: string, params: any): Promise<T> {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-msgpack'
      },
      body: JSON.stringify({
        method,
        params: Buffer.from(encode(params)).toString('base64'),
        id: 0
      })
    };

    return fetch(this.url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(result => {
        return decode(Buffer.from(result.Message, 'base64')) as Promise<T>;
      })
      .catch(error => {
        throw error;
      });
  }
};