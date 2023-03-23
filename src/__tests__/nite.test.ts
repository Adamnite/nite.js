/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

import { Nite, NiteError } from '../index';
import { Provider } from '../providers/provider';
import { match } from '../utils/result';

export class MockProvider implements Provider {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  send<T>(payload: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
    });
  }
};

const provider = new MockProvider('http://test.com');
const nite = new Nite(provider);

test('version', () => {
  const packageInfo = require('../../package.json');
  expect(nite.version).toBe(packageInfo.version);
});

test('getAccounts', () => {
  nite.getAccounts()
    .then(accounts => {
      expect(accounts.length).toBeGreaterThan(0);
      accounts.forEach(account => {
        expect(account.startsWith('0x'));
        expect(account.length).toBe('0x'.length + 130);
      });
    });
});

test('getBalance', () => {
  nite.getBalance('')
    .then(balance => {
      match(
        balance, {
          ok: _ => {
            expect(false);
          },
          err: e => {
            expect(e).toBe(NiteError.InvalidInput);
          }
        }
      );
    });

  nite.getBalance('0x04c205aa76174a126606bc6f411a1ee421e6c2219d4af8353f1a8b6ca359d796b7de2e5fb84c87a806dc40bcd30cda66712548c69b9779b58da9020a7342128a5f')
  .then(balance => {
    match(
      balance, {
        ok: v => {
          expect(v.length).toBeGreaterThan(0);
          expect(isNaN(+v)); // check if value is a number
        },
        err: e => {
          expect(false);
        }
      }
    );
  });
});
