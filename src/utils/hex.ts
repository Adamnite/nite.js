/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

export function isHex(value: string) {
  return value.match(/[0-9A-Fa-f]{6}/g);
}

export function toHex(value: string) : string {
  let hex = '';
  for (let i = 0; i < value.length; i++) {
   hex += '' + value.charCodeAt(i).toString(16);
  }
  return hex;
}