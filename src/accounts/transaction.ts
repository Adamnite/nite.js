/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

import { Result, isHex, toHex } from '../utils';

export interface Transaction {
  /**
   * Sender of the transaction.
   */
  from: string;

  /**
   * Recevier of the transaction.
   */
  to: string;

  /**
   * Gas price set by the transaction.
   */
  gasPrice: string;

  /**
   * Gas provided by the transaction.
   */
  gas: string;

  /**
   * Value of the transaction in micalli.
   */
  value: string;

  /**
   * Arbitrary data.
   */
  data: string;
};

export interface SignedTranscation {
  /**
   * Hash of the given message.
   */
  messageHash: string;

  /**
   * Encoded transaction.
   */
  rawTransaction: string;
};

export enum TransactionError {
  InvalidPrivateKey,
};

export function signTransaction(transaction: Transaction, privateKey: string) : Result<SignedTranscation, TransactionError> {
  const PRIVATE_KEY_HEX_LENGTH: number = 64;

  if (privateKey.startsWith('0x') || privateKey.startsWith('0X')) {
    privateKey = privateKey.slice(2);
  }

  if (!privateKey || privateKey.length != PRIVATE_KEY_HEX_LENGTH || !isHex(privateKey)) {
    return { ok: false, error: TransactionError.InvalidPrivateKey };
  }

  const hexTransaction = toHex(JSON.stringify(transaction));

  return {
    ok: true,
    value: {
      messageHash: '',
      rawTransaction: '',
    }
  };
}