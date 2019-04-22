# gov-delivery-node

An unofficial Node.js client library for GovDelivery's APIs
- [x] Communications Cloud
- [ ] Script Service API
- [ ] Targeted Messaging
- [ ] Interactive Text

## Quick start
### Install
```sh
npm install --save gov-delivery-node
```

### Usage
> ⚠️ While obvious to some, it is strongly recommended to store usernames, passwords and tokens in environment variables, e.g. `const username = process.env.USERNAME`
```js
const { CommunicationsCloud } = require('gov-delivery-node')

const baseUrl = process.env.BASE_URL // https://stage-api.govdelivery.com
const accountCode = process.env.ACCOUNT_CODE // 'CODE'
const username = process.env.USERNAME
const password = process.env.PASSWORD

// `new` is optional; returns a new client object regardless
const client = new CommunicationsCloud({ baseUrl, accountCode, username, password })
```
If your prefer explicitly linking objects over using JavaScript classes:
```js
const { CommunicationsCloud } = require('gov-delivery-node/communications-cloud')

/* ... */

const client = Object.create(CommunicationsCloud)
client.initialize({ baseUrl, accountCode, username, password })
```
This library is promise-based:
```js
client.subscriptions
  .add(/* ... */)
  .then(data => {
    /* handle formatted response data... */
  })
  .catch(error => {
    /* handle error... */
  )
```
Or using `async`/`await`:
```js
try {
  const data = await client.subscriptions.add(/* ... */)
} catch (error) {
  /* handle errors ... */
}
```

## API Documentation
See the official [API documentation](https://developer.govdelivery.com/) from GovDelivery.
