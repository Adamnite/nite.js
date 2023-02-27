/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export interface Matchers<T, E, R1, R2> {
  ok(value: T): R1;
  err(error: E): R2;
}

export const match = <T, E, R1, R2>(
  result: Result<T, E>,
  matchers: Matchers<T, E, R1, R2>,
) =>
  result.ok === true ? matchers.ok(result.value) : matchers.err(result.error);