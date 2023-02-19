/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

import { Provider } from "./provider";

export class HttpProvider implements Provider {
  /**
   * URL to send the RPC calls to.
   */
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  send<T>(payload: string): Promise<T> {
    const options = {
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    return fetch(this.url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<T>
      })
  }
};