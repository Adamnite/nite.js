/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

export interface Provider {
  /**
   * URL to send the RPC calls to.
   */
  url: string;

  /**
   * Send RPC calls.
   *
   * @param method RPC method to be called
   * @param params Parameters to send to the RPC method
   * @returns Promise
   */
  send<T>(method: string, params: any): Promise<T>;
};