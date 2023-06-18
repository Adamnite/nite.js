/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

import { SignedTranscation } from './accounts';
import { Provider } from './providers';
import { Result } from './utils';

import * as packageInfo from '../package.json';

export enum NiteError {
  InvalidInput,
  InvalidMessage,
  InvalidProvider,
  RpcCommunicationError
};

const isValidAddress = (address: string) => {
  const ADDRESS_LENGTH: number = 28;
  return address && address.length == ADDRESS_LENGTH;
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
   * Returns the Adamnite's chain ID.
   *
   * @returns The chain ID
   */
  async getChainID() : Promise<Result<string, NiteError>> {
    if (!this.provider) {
      return {
        ok: false,
        error: NiteError.InvalidProvider
      };
    }

    return await this.provider.send<string>("AdamniteServer.GetChainID", [])
      .then((result): Result<string, NiteError> => {
        return {
          ok: true,
          value: result
        };
      })
      .catch((error): Result<string, NiteError> => {
        console.log(`RPC communication error: ${error}`);
        return {
          ok: false,
          error: NiteError.RpcCommunicationError
        };
      });
  }

  /**
   * Returns the balance of an address at the latest block.
   *
   * @param address The address to get the balance of
   * @returns The current balance for the given address
   */
  async getBalance(address: string) : Promise<Result<string, NiteError>> {
    if (!isValidAddress(address)) {
      return {
        ok: false,
        error: NiteError.InvalidInput
      };
    }

    if (!this.provider) {
      return {
        ok: false,
        error: NiteError.InvalidProvider
      };
    }

    return await this.provider.send<string>("AdamniteServer.GetBalance", [address])
      .then((result): Result<string, NiteError>  => {
        return {
          ok: true,
          value: result
        };
      })
      .catch((error): Result<string, NiteError> => {
        console.log(`RPC communication error: ${error}`);
        return {
          ok: false,
          error: NiteError.RpcCommunicationError
        }
      });
  }

  /**
   * Returns accounts managed by the node.
   *
   * @returns Accounts managed by the node
   */
  async getAccounts() : Promise<Result<string[], NiteError>> {
    if (!this.provider) {
      return {
        ok: false,
        error: NiteError.InvalidProvider
      };
    }

    return await this.provider.send<string[]>("AdamniteServer.GetAccounts", [])
      .then((result): Result<string[], NiteError> => {
        return {
          ok: true,
          value: result
        };
      })
      .catch((error): Result<string[], NiteError> => {
        console.log(`RPC communication error: ${error}`);
        return {
          ok: false,
          error: NiteError.RpcCommunicationError
        };
      });
  }

  /**
   * Adds new account.
   *
   * @param address Address of an account to be added
   * @returns True if operation was successful, false otherwise
   */
  async addAccount(address: string) : Promise<Result<boolean, NiteError>> {
    if (!isValidAddress(address)) {
      return {
        ok: false,
        error: NiteError.InvalidInput
      };
    }

    if (!this.provider) {
      return {
        ok: false,
        error: NiteError.InvalidProvider
      };
    }

    return await this.provider.send<boolean>("AdamniteServer.CreateAccount", [address])
      .then((result): Result<boolean, NiteError> => {
        return {
          ok: true,
          value: result
        };
      })
      .catch((error): Result<boolean, NiteError> => {
        console.log(`RPC communication error: ${error}`);
        return {
          ok: false,
          error: NiteError.RpcCommunicationError
        };
      });
  }

  /**
   * Sends transaction.
   *
   * @param transaction Signed transaction
   * @returns True if operation was successful, false otherwise
   */
  async sendTransaction(transaction: SignedTranscation) : Promise<Result<boolean, NiteError>> {
    if (!transaction.hash || !transaction.raw) {
      return {
        ok: false,
        error: NiteError.InvalidInput
      };
    }

    if (!this.provider) {
      return {
        ok: false,
        error: NiteError.InvalidProvider
      };
    }

    return await this.provider.send<boolean>("AdamniteServer.SendTransaction", [transaction.hash, transaction.raw])
      .then((result): Result<boolean, NiteError> => {
        return {
          ok: true,
          value: result
        };
      })
      .catch((error): Result<boolean, NiteError> => {
        console.log(`RPC communication error: ${error}`);
        return {
          ok: false,
          error: NiteError.RpcCommunicationError
        };
      });
  }

  /**
   * Sends Caesar message.
   *
   * @param message Caesar message
   * @returns True if operation was successful, false otherwise
   */
  async sendMessage(message: string) : Promise<Result<boolean, NiteError>> {
    if (!message) {
      return {
        ok: false,
        error: NiteError.InvalidMessage
      };
    }

    if (!this.provider) {
      return {
        ok: false,
        error: NiteError.InvalidProvider
      };
    }

    return await this.provider.send<boolean>("AdamniteServer.NewCaesarMessage", [message])
      .then((result): Result<boolean, NiteError> => {
        return {
          ok: true,
          value: result
        };
      })
      .catch((error): Result<boolean, NiteError> => {
        console.log(`RPC communication error: ${error}`);
        return {
          ok: false,
          error: NiteError.RpcCommunicationError
        };
      });
  }
}
