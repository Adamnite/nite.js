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
  '23m3Ho7PwouaFzU8iXMLo7Pwoadf',
  '8iXMLygwuXNW7zU8iXMLygwuXNW7',
  '69m3Ho7PwouaFzU69m3Ho7PwouaF',
];

export class MockProvider implements Provider {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  async send<T>(method: string, _: any): Promise<T> {
    if (method === 'AdamniteServer.GetChainID') {
      return CHAIN_ID as T;
    } else if (method === 'AdamniteServer.GetBalance') {
      return BALANCE as T;
    } else if (method === 'AdamniteServer.GetAccounts') {
      return ACCOUNTS as T;
    } else if (method === 'AdamniteServer.CreateAccount') {
      return true as T;
    } else if (method === 'AdamniteServer.SendTransaction') {
      return true as T;
    } else if (method === 'AdamniteServer.NewCaesarMessage') {
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

  await nite.getBalance('23m3Ho7PwouaFz')
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

  await nite.getBalance('23m3Ho7PwouaFzU8iXMLygwuXNW7')
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
              expect(account.length).toBe(28);
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

  await nite.addAccount('23m3Ho7PwouaFzU8iXMLygwuXNW7')
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
  await nite.sendTransaction({ hash: '', raw: '' })
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

  await nite.sendTransaction({
    hash: '0x999205aa76174a126606bc6f411a1ee421e6c',
    raw: '0x7712205aa76174a126606bc6f411a1ee421e6c'
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

test('sendMessage', async () => {
  await nite.sendMessage('')
    .then(result => {
      match(
        result, {
          ok: _ => {
            expect(false).toBeTruthy();
          },
          err: e => {
            expect(e).toBe(NiteError.InvalidMessage);
          }
        }
      )
    }, _ => {
      expect(false).toBeTruthy();
    })
    .catch(_ => {
      expect(false).toBeTruthy();
    });

  await nite.sendMessage('Hello, world!')
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
