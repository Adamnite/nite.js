/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

import { Account, createAccount } from './accounts/account';
import { Provider } from './providers/provider';
import { Result, match } from './utils/result';

import * as packageInfo from '../package.json';

export enum NiteError {
  InvalidInput
};

export class Nite {
  /**
   * Version of the Adamnite JavaScript API.
   */
  readonly version: string = packageInfo.version;

  /**
   * Provider responsible for the communication with the blockchain.
   * It takes RPC requests and returns the response.
   */
  private provider: Provider | null = null;

  constructor(provider: Provider) {
    this.provider = provider;
  }

  /**
   * Sets provider to be used for the communication with the blockchain.
   *
   * @param provider A valid provider
   */
  setProvider(provider: Provider) {
    this.provider = provider;
  }

  /**
   * Returns the current provider being used.
   *
   * @returns The current provider or null
   */
  currentProvider() : Provider | null {
    return this.provider;
  }

  /**
   * Returns the Adamnite protocol version of the node.
   *
   * @returns The protocol version
   */
  getProtocolVersion() : string {
    return '1.0.0';
  }

  /**
   * Returns transaction fee history.
   *
   * @returns Transaction fee history
   */
  getFeeHistory() : object[] {
    return [];
  }

  /**
   * Returns accounts managed by the node.
   *
   * @returns Accounts managed by the node
   */
  async getAccounts() : Promise<string[]> {
    let accounts: string[] = [];

    /**
     * Mock few accounts for testing integration purposes.
     * @todo Remove once Adamnite RPC is implemented.
     */
    match(
      createAccount(), {
        ok: v => { accounts.push(v.address); },
        err: _ => {}
      }
    );
    match(
      createAccount(), {
        ok: v => { accounts.push(v.address); },
        err: _ => {}
      }
    );
    match(
      createAccount(), {
        ok: v => { accounts.push(v.address); },
        err: _ => {}
      }
    );

    return accounts;
  }

  /**
   * Returns the balance of an address at the latest block.
   *
   * @param address The address to get the balance of
   * @returns The current balance for the given address
   */
  async getBalance(address: string) : Promise<Result<string, NiteError>> {
    if (!address) {
      return {
        ok: false,
        error: NiteError.InvalidInput
      };
    }

    /**
     * Mock balance for testing integration purposes.
     * @todo Remove once Adamnite RPC is implemented.
     */
    return {
      ok: true,
      value: '1000000000000'
    };
  }
}
