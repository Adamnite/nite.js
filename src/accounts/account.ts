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
  InvalidPrivateKey,
  RecoveryPhraseGenerationFailed,
};

const getRandomRecoveryPhrase = () => {
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

  return chunks?.map(binary => {
    const idx = parseInt(binary, 2);
    return words[idx];
  });
}

/**
 * Creates a new account.
 *
 * @returns New account
 */
export function createAccount() : Result<Account, AccountError> {
  const recoveryPhrase = getRandomRecoveryPhrase();

  if (!recoveryPhrase) {
    return { ok: false, error: AccountError.RecoveryPhraseGenerationFailed };
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

/**
 * Creates an account from private key.
 *
 * @param privateKey The private key in hex format to get an account for
 * @returns New account
 */
export function getAccountFromPrivateKey(privateKey: string) : Result<Account, AccountError> {
  const recoveryPhrase = getRandomRecoveryPhrase();

  if (!recoveryPhrase) {
    return { ok: false, error: AccountError.RecoveryPhraseGenerationFailed };
  }

  if (privateKey.startsWith('0x') || privateKey.startsWith('0X')) {
    privateKey = privateKey.slice(2);
  }

  const PRIVATE_KEY_HEX_LENGTH: number = 64;

  const isHex = (value: string) => {
    return value.match('/[0-9A-Fa-f]{6}/g');
  }

  if (!privateKey || privateKey.length != PRIVATE_KEY_HEX_LENGTH || !isHex(privateKey)) {
    return { ok: false, error: AccountError.InvalidPrivateKey };
  }

  const publicKey = secp256k1.getPublicKey(privateKey);

  return {
    ok: true,
    value: {
      address: Buffer.from(publicKey).toString('hex'),
      privateKey: privateKey,
      recoveryPhrase: recoveryPhrase
    }
  };
}