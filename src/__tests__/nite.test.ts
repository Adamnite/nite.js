/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

import Nite from '../index';
import { Provider } from '../providers/provider';

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