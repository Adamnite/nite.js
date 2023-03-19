/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

import { Account, AccountError, createAccount, getAccountFromPrivateKey } from '../accounts/account';
import * as words from '../internal/words.json';
import { match } from '../utils/result';

test('createAccount', () => {
  match(
    createAccount(), {
      ok: v => {
        const newAccount = v as Account;

        expect(newAccount.address.startsWith('0x')).toBe(true);
        expect(newAccount.privateKey.startsWith('0x')).toBe(true);

        expect(newAccount.address.length).toBe('0x'.length + 130);
        expect(newAccount.privateKey.length).toBe('0x'.length + 64);

        expect(newAccount.recoveryPhrase.length).toBe(24);
        expect(newAccount.recoveryPhrase.every(
          phrase => words.includes(phrase)
        )).toBe(true);
      },
      err: e => {
        expect(false);
      }
    }
  );
});

test('getAccountFromPrivateKey', () => {
  match(
    getAccountFromPrivateKey(''), {
      ok: v => {
        expect(false);
      },
      err: e => {
        expect(e as AccountError).toBe(AccountError.InvalidPrivateKey);
      }
    }
  );

  match(
    getAccountFromPrivateKey('0xd6c0c61f6db291d5638340cb09a4431e'), {
      ok: v => {
        expect(false);
      },
      err: e => {
        expect(e as AccountError).toBe(AccountError.InvalidPrivateKey);
      }
    }
  );

  match(
    getAccountFromPrivateKey('0xzzzzzd6c0c61f6db291d5638340cb09a'), {
      ok: v => {
        expect(false);
      },
      err: e => {
        expect(e as AccountError).toBe(AccountError.InvalidPrivateKey);
      }
    }
  );

  const privateKey = '0xd6c0c61f6db291d5638340cb09a4431e4a600dcb8f21e3edba103c73de9d279f';
  const address = '0x04c205aa76174a126606bc6f411a1ee421e6c2219d4af8353f1a8b6ca359d796b7de2e5fb84c87a806dc40bcd30cda66712548c69b9779b58da9020a7342128a5f';

  match(
    getAccountFromPrivateKey(privateKey), {
      ok: v => {
        const newAccount = v as Account;

        expect(newAccount.address).toBe(address);
        expect(newAccount.privateKey).toBe(privateKey);

        expect(newAccount.recoveryPhrase.length).toBe(24);
        expect(newAccount.recoveryPhrase.every(
          phrase => words.includes(phrase)
        )).toBe(true);
      },
      err: e => {
        expect(false);
      }
    }
  );
});