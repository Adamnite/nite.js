/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

import { sha256 } from '@noble/hashes/sha256';
import { hmac } from '@noble/hashes/hmac';
import * as secp256k1 from '@noble/secp256k1';

import { Result, toHex, isValidHexPrivateKey } from '../utils';

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
  hash: string;

  /**
   * Encoded transaction.
   */
  raw: string;
};

export enum TransactionError {
  InvalidPrivateKey,
};

export function signTransaction(transaction: Transaction, privateKey: string) : Result<SignedTranscation, TransactionError> {
  if (privateKey.startsWith('0x') || privateKey.startsWith('0X')) {
    privateKey = privateKey.slice(2);
  }

  if (!isValidHexPrivateKey(privateKey)) {
    return { ok: false, error: TransactionError.InvalidPrivateKey };
  }

  const rawTransaction = toHex(JSON.stringify(transaction));

  secp256k1.utils.hmacSha256Sync = (k, ...m) => hmac(sha256, k, secp256k1.utils.concatBytes(...m));

  return {
    ok: true,
    value: {
      hash: '0x' + Buffer.from(secp256k1.signSync(rawTransaction, privateKey)).toString('hex'),
      raw: rawTransaction,
    }
  };
}