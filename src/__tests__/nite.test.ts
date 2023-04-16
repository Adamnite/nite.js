/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

import { Nite, NiteError } from '../index';
import { HttpProvider, Provider } from '../providers';
import { match } from '../utils';

const CHAIN_ID: string = '123';
const BALANCE: string = '10000000';
const ACCOUNTS: string[] = [
  '0x04c205aa76174a126606bc6f411a1ee421e6c2219d4af8353f1a8b6ca359d796b7de2e5fb84c87a806dc40bcd30cda66712548c69b9779b58da9020a7342128a5f',
  '0x15c205aa76174a126606bc6f411a1ee421e6c2219d4af8353f1a8b6ca359d796b7de2e5fb84c87a806dc40bcd30cda66712548c69b9779b58da9020a7342128a5f',
  '0x26c205aa76174a126606bc6f411a1ee421e6c2219d4af8353f1a8b6ca359d796b7de2e5fb84c87a806dc40bcd30cda66712548c69b9779b58da9020a7342128a5f',
];

export class MockProvider implements Provider {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  async send<T>(method: string, _: any): Promise<T> {
    if (method === 'Adamnite.GetChainID') {
      return CHAIN_ID as T;
    } else if (method === 'Adamnite.GetBalance') {
      return BALANCE as T;
    } else if (method === 'Adamnite.GetAccounts') {
      return ACCOUNTS as T;
    } else if (method === 'Adamnite.CreateAccount') {
      return true as T;
    } else if (method === 'Adamnite.SendTransaction') {
      return true as T;
    }
    return {} as T;
  }
};

const provider = new MockProvider('http://test.com');
const nite = new Nite(provider);

test('version', () => {
  const packageInfo = require('../../package.json');
  expect(nite.version).toBe(packageInfo.version);
});

test('getChainID', async () => {
  await nite.getChainID()
    .then(chainID => {
      match(
        chainID, {
          ok: v => {
            expect(v.length).toBeGreaterThan(0);
            expect(isNaN(+v)); // check if value is a number
            expect(v).toBe(CHAIN_ID);
          },
          err: _ => {
            expect(false).toBeTruthy();
          }
        }
      );
    }, _ => {
      expect(false).toBeTruthy();
    })
    .catch(_ => {
      expect(false).toBeTruthy();
    });
});

test('getBalance', async () => {
  await nite.getBalance('')
    .then(balance => {
      match(
        balance, {
          ok: _ => {
            expect(false).toBeTruthy();
          },
          err: e => {
            expect(e).toBe(NiteError.InvalidInput);
          }
        }
      );
    }, _ => {
      expect(false).toBeTruthy();
    })
    .catch(_ => {
      expect(false).toBeTruthy();
    });

  await nite.getBalance('0x04c205aa76174a126606bc6f411a1ee421e6c2219')
    .then(balance => {
      match(
        balance, {
          ok: _ => {
            expect(false).toBeTruthy();
          },
          err: e => {
            expect(e).toBe(NiteError.InvalidInput);
          }
        }
      );
    }, _ => {
      expect(false).toBeTruthy();
    })
    .catch(_ => {
      expect(false).toBeTruthy();
    });

  await nite.getBalance('04c205aa76174a126606bc6f411a1ee421e6c2219d4af8353f1a8b6ca359d796b7de2e5fb84c87a806dc40bcd30cda66712548c69b9779b58da9020a7342128a5f')
    .then(balance => {
      match(
        balance, {
          ok: _ => {
            expect(false).toBeTruthy();
          },
          err: e => {
            expect(e).toBe(NiteError.InvalidInput);
          }
        }
      );
    }, _ => {
      expect(false).toBeTruthy();
    })
    .catch(_ => {
      expect(false).toBeTruthy();
    });

  await nite.getBalance('0x04c205aa76174a126606bc6f411a1ee421e6c2219d4af8353f1a8b6ca359d796b7de2e5fb84c87a806dc40bcd30cda66712548c69b9779b58da9020a7342128a5f')
    .then(balance => {
      match(
        balance, {
          ok: v => {
            expect(v.length).toBeGreaterThan(0);
            expect(isNaN(+v)); // check if value is a number
            expect(v).toBe(BALANCE);
          },
          err: _ => {
            expect(false).toBeTruthy();
          }
        }
      );
    }, _ => {
      expect(false).toBeTruthy();
    })
    .catch(_ => {
      expect(false).toBeTruthy();
    });
});

test('getAccounts', async () => {
  await nite.getAccounts()
    .then(accounts => {
      match(
        accounts, {
          ok: v => {
            expect(v.length).toBeGreaterThan(0);
            v.forEach(account => {
              expect(account.startsWith('0x'));
              expect(account.length).toBe('0x'.length + 130);
            });
          },
          err: _ => {
            expect(false).toBeTruthy();
          }
        }
      )
    }, _ => {
      expect(false).toBeTruthy();
    })
    .catch(_ => {
      expect(false).toBeTruthy();
    });
});

test('addAccount', async () => {
  await nite.addAccount('')
    .then(result => {
      match(
        result, {
          ok: _ => {
            expect(false).toBeTruthy();
          },
          err: e => {
            expect(e).toBe(NiteError.InvalidInput);
          }
        }
      )
    }, _ => {
      expect(false).toBeTruthy();
    })
    .catch(_ => {
      expect(false).toBeTruthy();
    });

  await nite.addAccount('0x999205aa76174a126606bc6f411a1ee421e6c2219d4af8353f1a8b6ca359d796b7de2e5fb84c87a806dc40bcd30cda66712548c69b9779b58da9020a7342128a5f')
    .then(result => {
      match(
        result, {
          ok: v => {
            expect(v).toBeTruthy();
          },
          err: _ => {
            expect(false).toBeTruthy();
          }
        }
      )
    }, _ => {
      expect(false).toBeTruthy();
    })
    .catch(_ => {
      expect(false).toBeTruthy();
    });
});

test('sendTransaction', async () => {
  await nite.sendTransaction({
    messageHash: '0x999205aa76174a126606bc6f411a1ee421e6c',
    rawTransaction: '0x7712205aa76174a126606bc6f411a1ee421e6c'
  })
    .then(result => {
      match(
        result, {
          ok: v => {
            expect(v).toBeTruthy();
          },
          err: _ => {
            expect(false).toBeTruthy();
          }
        }
      )
    }, _ => {
      expect(false).toBeTruthy();
    })
    .catch(_ => {
      expect(false).toBeTruthy();
    });
});
