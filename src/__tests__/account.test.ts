/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

import { AccountError, createAccount, getAccountFromPrivateKey, sign } from '../accounts';
import * as words from '../internal/words.json';
import { match } from '../utils';

test('createAccount', () => {
  match(
    createAccount(), {
      ok: v => {
        expect(v.address.startsWith('0x'));
        expect(v.privateKey.startsWith('0x'));

        expect(v.address.length).toBe('0x'.length + 130);
        expect(v.privateKey.length).toBe('0x'.length + 64);

        expect(v.recoveryPhrase.length).toBe(24);
        expect(v.recoveryPhrase.every(
          phrase => words.includes(phrase)
        )).toBe(true);
      },
      err: _ => {
        expect(false).toBeTruthy();
      }
    }
  );
});

test('getAccountFromPrivateKey', () => {
  match(
    getAccountFromPrivateKey(''), {
      ok: _ => {
        expect(false).toBeTruthy();
      },
      err: e => {
        expect(e).toBe(AccountError.InvalidPrivateKey);
      }
    }
  );

  match(
    getAccountFromPrivateKey('0xd6c0c61f6db291d5638340cb09a4431e'), {
      ok: _ => {
        expect(false).toBeTruthy();
      },
      err: e => {
        expect(e).toBe(AccountError.InvalidPrivateKey);
      }
    }
  );

  match(
    getAccountFromPrivateKey('0xzzzzzd6c0c61f6db291d5638340cb09a'), {
      ok: _ => {
        expect(false).toBeTruthy();
      },
      err: e => {
        expect(e).toBe(AccountError.InvalidPrivateKey);
      }
    }
  );

  const privateKey = '0xd6c0c61f6db291d5638340cb09a4431e4a600dcb8f21e3edba103c73de9d279f';
  const address = '0x04c205aa76174a126606bc6f411a1ee421e6c2219d4af8353f1a8b6ca359d796b7de2e5fb84c87a806dc40bcd30cda66712548c69b9779b58da9020a7342128a5f';

  match(
    getAccountFromPrivateKey(privateKey), {
      ok: v => {
        expect(v.address).toBe(address);
        expect(v.privateKey).toBe(privateKey);

        expect(v.recoveryPhrase.length).toBe(24);
        expect(v.recoveryPhrase.every(
          phrase => words.includes(phrase)
        )).toBe(true);
      },
      err: _ => {
        expect(false).toBeTruthy();
      }
    }
  );
});

test('sign', () => {
  match(
    sign('Test message', ''), {
      ok: _ => {
        expect(false).toBeTruthy();
      },
      err: e => {
        expect(e).toBe(AccountError.InvalidPrivateKey);
      }
    }
  );

  match(
    sign('Test message', '0xd6c0c61f6db291d5638340cb09a4431e'), {
      ok: _ => {
        expect(false).toBeTruthy();
      },
      err: e => {
        expect(e).toBe(AccountError.InvalidPrivateKey);
      }
    }
  );

  match(
    sign('Test message', '0xzzzzzd6c0c61f6db291d5638340cb09a'), {
      ok: _ => {
        expect(false).toBeTruthy();
      },
      err: e => {
        expect(e).toBe(AccountError.InvalidPrivateKey);
      }
    }
  );

  match(
    sign('Test message', 'd6c0c61f6db291d5638340cb09a4431e4a600dcb8f21e3edba103c73de9d279f'), {
      ok: v => {
        expect(v).toBe('0x30440220658c6c5862da3992c3acfe7c2ad2a8e623369d3a7e0828fb6a55aae1c8ccfd09022038b78224d99255eb23fe988ac28e76804ba7de8c6d469fd4633631a8075f94cb');
      },
      err: _ => {
        expect(false).toBeTruthy();
      }
    }
  );

  match(
    sign('Test message', '0xd6c0c61f6db291d5638340cb09a4431e4a600dcb8f21e3edba103c73de9d279f'), {
      ok: v => {
        expect(v).toBe('0x30440220658c6c5862da3992c3acfe7c2ad2a8e623369d3a7e0828fb6a55aae1c8ccfd09022038b78224d99255eb23fe988ac28e76804ba7de8c6d469fd4633631a8075f94cb');
      },
      err: _ => {
        expect(false).toBeTruthy();
      }
    }
  );

  match(
    sign('Test message', '0Xd6c0c61f6db291d5638340cb09a4431e4a600dcb8f21e3edba103c73de9d279f'), {
      ok: v => {
        expect(v).toBe('0x30440220658c6c5862da3992c3acfe7c2ad2a8e623369d3a7e0828fb6a55aae1c8ccfd09022038b78224d99255eb23fe988ac28e76804ba7de8c6d469fd4633631a8075f94cb');
      },
      err: _ => {
        expect(false).toBeTruthy();
      }
    }
  );
});