# nite.js

Adamnite Javascript API

## Getting started

```js
import { Nite } from 'nite';
import { HttpProvider } from 'nite/providers';
import { match } from 'nite/utils';

const provider = new HttpProvider('http://127.0.0.1:3000/v1/');
const nite = new Nite(provider);

await nite.getAccounts()
  .then(result => {
    match(
      result, {
        ok: accounts => {
          console.log(`Accounts: ${accounts}`);
        },
        err: e = {
          console.log(`Error: ${e}`);
        }
      }
    )
  })
  .catch(e => {
    console.log(`Error: ${e}`);
  });
```
