/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

import { isHex } from "./hex";

export function isValidPrivateKey(key: string) {
  const PRIVATE_KEY_HEX_LENGTH: number = 64;

  if (key.startsWith('0x') || key.startsWith('0X')) {
    key = key.slice(2);
  }

  return key && key.length == PRIVATE_KEY_HEX_LENGTH && isHex(key);
}
