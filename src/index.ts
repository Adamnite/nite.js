/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

import { sha256 } from '@noble/hashes/sha256';
import { hmac } from '@noble/hashes/hmac';
import * as secp256k1 from '@noble/secp256k1';

import { SignedTranscation } from './accounts';
import { Provider } from './providers';
import { isHex, toHex, isValidHexPrivateKey, Result } from './utils';

import * as packageInfo from '../package.json';

export enum NiteError {
  InvalidInput,
  InvalidMessage,
  InvalidProvider,
  InvalidReceiverPublicKey,
  InvalidSenderPrivateKey,
  InvalidSenderPublicKey,
  RpcCommunicationError
};

const isValidAddress = (address: string) => {
  const ADDRESS_LENGTH: number = 28;
  return address && address.length === ADDRESS_LENGTH;
};

const isValidHexPublicKey = (key: string) => {
  const HEX_PUBLIC_KEY_LENGTH: number = 130;
  return key && key.length === HEX_PUBLIC_KEY_LENGTH && isHex(key);
};

interface Message {
  fromPublicKey: string;
  timestamp: number;
  content: string;
}

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

    return await this.provider.send<string>('BouncerServer.GetChainID', [])
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

    return await this.provider.send<string>('BouncerServer.GetBalance', [address])
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

    return await this.provider.send<string[]>('BouncerServer.GetAccounts', [])
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
    if (!this.provider) {
      return {
        ok: false,
        error: NiteError.InvalidProvider
      };
    }

    if (!isValidAddress(address)) {
      return {
        ok: false,
        error: NiteError.InvalidInput
      };
    }

    return await this.provider.send<boolean>('BouncerServer.CreateAccount', [address])
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
    if (!this.provider) {
      return {
        ok: false,
        error: NiteError.InvalidProvider
      };
    }

    if (!transaction.hash || !transaction.raw) {
      return {
        ok: false,
        error: NiteError.InvalidInput
      };
    }

    return await this.provider.send<boolean>('BouncerServer.SendTransaction', [transaction.hash, transaction.raw])
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
   * @param fromPrivateKey Sender's private key in hexadecimal format
   * @param fromPublicKey Sender's public key in hexadecimal format
   * @param toPublicKey Receiver's public key in hexadecimal format
   * @param message Caesar message
   * @returns True if operation was successful, false otherwise
   */
  async sendMessage(
    fromPrivateKey: string,
    fromPublicKey: string,
    toPublicKey: string,
    message: string
  ) : Promise<Result<boolean, NiteError>> {
    if (!this.provider) {
      return {
        ok: false,
        error: NiteError.InvalidProvider
      };
    }

    if (fromPrivateKey.startsWith('0x') || fromPrivateKey.startsWith('0X')) {
      fromPrivateKey = fromPrivateKey.slice(2);
    }
    if (fromPublicKey.startsWith('0x') || fromPublicKey.startsWith('0X')) {
      fromPublicKey = fromPublicKey.slice(2);
    }
    if (toPublicKey.startsWith('0x') || toPublicKey.startsWith('0X')) {
      toPublicKey = toPublicKey.slice(2);
    }

    if (!isValidHexPrivateKey(fromPrivateKey)) {
      return {
        ok: false,
        error: NiteError.InvalidSenderPrivateKey
      };
    }
    if (!isValidHexPublicKey(fromPublicKey)) {
      return {
        ok: false,
        error: NiteError.InvalidSenderPublicKey
      };
    }
    if (!isValidHexPublicKey(toPublicKey)) {
      return {
        ok: false,
        error: NiteError.InvalidReceiverPublicKey
      };
    }

    if (!message) {
      return {
        ok: false,
        error: NiteError.InvalidMessage
      };
    }

    const AES = require('crypto-js/aes');
    const encryptedMessage = AES.encrypt(message, toPublicKey).ciphertext.toString();

    secp256k1.utils.hmacSha256Sync = (k, ...m) => hmac(sha256, k, secp256k1.utils.concatBytes(...m));
    const signedMessage = secp256k1.signSync(encryptedMessage, fromPrivateKey);

    return await this.provider.send<boolean>(
      'BouncerServer.NewMessage',
      [
        fromPublicKey,
        toPublicKey,
        toHex(message),
        Buffer.from(signedMessage).toString('hex'),
      ]
    )
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
   * Gets Caesar messages sent between two accounts.
   *
   * @param fromPublicKey Sender's public key in hexadecimal format
   * @param toPublicKey Receiver's public key in hexadecimal format
   * @returns Caesar messages
   */
  async getMessages(fromPublicKey: string, toPublicKey: string) : Promise<Result<Message[], NiteError>> {
    if (!this.provider) {
      return {
        ok: false,
        error: NiteError.InvalidProvider
      };
    }

    if (fromPublicKey.startsWith('0x') || fromPublicKey.startsWith('0X')) {
      fromPublicKey = fromPublicKey.slice(2);
    }
    if (toPublicKey.startsWith('0x') || toPublicKey.startsWith('0X')) {
      toPublicKey = toPublicKey.slice(2);
    }

    if (!isValidHexPublicKey(fromPublicKey)) {
      return {
        ok: false,
        error: NiteError.InvalidSenderPublicKey
      };
    }
    if (!isValidHexPublicKey(toPublicKey)) {
      return {
        ok: false,
        error: NiteError.InvalidReceiverPublicKey
      };
    }

    const AES = require('crypto-js/aes');

    return await this.provider.send<Message[]>('BouncerServer.GetMessages', [fromPublicKey, toPublicKey,])
      .then((result): Result<Message[], NiteError> => {
        return {
          ok: true,
          value: result.map(message => ({
            fromPublicKey: message.fromPublicKey,
            timestamp: message.timestamp,
            content: Buffer.from(message.content, 'hex').toString()
          }))
        };
      })
      .catch((error): Result<Message[], NiteError> => {
        console.log(`RPC communication error: ${error}`);
        return {
          ok: false,
          error: NiteError.RpcCommunicationError
        };
      });
  }
}
