/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

const packageInfo = require('../package.json');

class Nite {
  /**
   * Version of the Adamnite JavaScript API.
   */
  version: string = packageInfo.version;

  /**
   * Provider responsible for the communication with the blockchain.
   * It takes JSON-RPC requests and returns the response.
   */
  provider: string | null = null;

  constructor(provider: string) {
    this.provider = provider;
  }

  /**
   * Sets provider to be used for the communication with the blockchain.
   *
   * @param provider A valid provider
   */
  setProvider(provider: string) {
    this.provider = provider;
  }

  /**
   * Returns the current provider being used.
   *
   * @returns The current provider or null
   */
  currentProvider() : string | null {
    return this.provider;
  }

  /**
   * Returns the Adamnite protocol version of the node.
   *
   * @returns The protocol version
   */
  getProtocolVersion() : string {
    return "1.0.0";
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
   * @returns Addresses
   */
  getAccounts() : object[] {
    return [];
  }

  /**
   * Returns the balance of an address at the latest block.
   *
   * @param address The address to get the balance of
   * @returns The current balance for the given address
   */
  getBalance(address: string) : string {
    return "";
  }
}

export default Nite;
