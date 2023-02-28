/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

import { randomBytes } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';
import * as secp256k1 from '@noble/secp256k1';

import * as words from '../internal/words.json';
import { Result } from '../utils/result';

export interface Account {
  /**
   * Account's address i.e. public key of SECP256k1 elliptic curve.
   */
  address: string;

  /**
   * Account's private key of SECP256k1 elliptic curve.
   */
  privateKey: string;

  /**
   * Recovery phrase consisted of 24 words used to login into account.
   */
  recoveryPhrase: string[];
};

export enum AccountError {
  Generic
};

/**
 * Creates a new account.
 *
 * @returns New account
 */
export function createAccount() : Result<Account, AccountError> {
  const padLeft = (str: string, padding: string, length: number) => {
    while (str.length < length) {
      str = padding + str;
    }
    return str;
  };

  const toBinary = (bytes: Uint8Array) => {
    let binary = '';
    for (let i in bytes) {
      binary += padLeft(bytes[i].toString(2), '0', 8);
    }
    return binary;
  };

  const ENTROPY_BITS_COUNT = 256;
  const ENTROPY_BYTES_COUNT = ENTROPY_BITS_COUNT / 8;
  const entropy = randomBytes(ENTROPY_BYTES_COUNT);

  const entropyBits = toBinary(entropy);
  const checksumBits = toBinary(sha256(entropy)).slice(0, ENTROPY_BITS_COUNT / 32);

  const bits = entropyBits + checksumBits;
  const chunks = bits.match(/(.{1,11})/g);

  const recoveryPhrase = chunks?.map(binary => {
    const idx = parseInt(binary, 2);
    return words[idx];
  });

  if (!recoveryPhrase) {
    return { ok: false, error: AccountError.Generic };
  }

  const privateKey = secp256k1.utils.randomPrivateKey();
  const publicKey = secp256k1.getPublicKey(privateKey);

  return {
    ok: true,
    value: {
      address: Buffer.from(publicKey).toString('hex'),
      privateKey: Buffer.from(privateKey).toString('hex'),
      recoveryPhrase: recoveryPhrase
    }
  };
};