/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

import { Account, createAccount } from '../accounts/account';
import * as words from '../internal/words.json';
import { match } from '../utils/result';

test('create', () => {
  const account = createAccount();
  match(
    account, {
      ok: v => {
        expect((v as Account).recoveryPhrase.every(
          phrase => words.includes(phrase)
        )).toBe(true);
      },
      err: e => {
        expect(false);
      }
    }
  );
});