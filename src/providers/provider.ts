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
   * @param payload Payload to be sent
   * @returns Promise
   */
  send<T>(payload: string): Promise<T>;
};