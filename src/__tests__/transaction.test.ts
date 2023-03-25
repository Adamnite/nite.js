/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

import { signTransaction, TransactionError } from "../accounts";
import { match } from '../utils';

const transaction = {
  from: '0x04c205aa76174a126606bc6f411a1ee421e6c2219d4af8353f1a8b6ca359d796b7de2e5fb84c87a806dc40bcd30cda66712548c69b9779b58da9020a7342128a5f',
  to: '0x96b7de2e5fb84c87a806dc40bcd30cda66712548c69b9779b58da9020a7342128a5f04c205aa76174a126606bc6f411a1ee421e6c2219d4af8353f1a8b6ca359d7',
  gasPrice: '10000000000',
  gas: '31000',
  value: '1000000000000000000',
  data: '',
};

test('signTransaction', () => {
  match(
    signTransaction(transaction, ''), {
      ok: _ => {
        expect(false).toBeTruthy();
      },
      err: e => {
        expect(e).toBe(TransactionError.InvalidPrivateKey);
      }
    }
  );
});
