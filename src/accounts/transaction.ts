/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

import { Result } from "../utils/result";

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
};

export async function signTransaction(transaction: Transaction) : Promise<Result<SignedTranscation, TransactionError>> {
  return {
    ok: true,
    value: {
      messageHash: '',
      rawTransaction: '',
    }
  };
}