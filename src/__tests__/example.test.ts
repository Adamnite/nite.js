import Nite from '../index';

test('version', () => {
    const packageInfo = require('../../package.json');

    let nite = new Nite('test-provider');
    expect(nite.version).toBe(packageInfo.version);
});