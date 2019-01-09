# @req-json/rate-limit

[![npm][npm-version]][npm]
[![npm][npm-size]][npm]
[![npm][npm-downloads]][npm]
[![npm][npm-license]][npm]


[![github][github-issues]][github]
[![travis][travis-build]][travis]
[![codecov][codecov-svg]][codecov]


Rate limit middleware for [req-json][req-json].

## Installation

### NPM

```
npm install @req-json/rate-limit --save
```

```js
import ReqJSON from 'req-json';
import reqJSONERateLimit from '@req-json/rate-limit';

const reqJSON = new ReqJSON();
reqJSON.use(reqJSONERateLimit());
```

### Browser

Direct `<script>` include

```html
<script src="https://cdn.jsdelivr.net/npm/@req-json/rate-limit"></script>
```

## Options

Rate limit middleware options and defaults.

```js
reqJSON.use(reqJSONERateLimit({
  methods: [ // request methods to apply rate limit
    'POST',
    'PUT'
  ],
  frequency: 1000 // request only once in 1000ms
}));
```

[req-json]: https://github.com/Cweili/req-json

[npm]: https://www.npmjs.com/package/@req-json/rate-limit
[npm-version]: https://img.shields.io/npm/v/@req-json%2Frate-limit.svg
[npm-size]: https://img.shields.io/bundlephobia/minzip/@req-json%2Frate-limit.svg
[npm-downloads]: https://img.shields.io/npm/dt/@req-json%2Frate-limit.svg
[npm-license]: https://img.shields.io/npm/l/@req-json%2Frate-limit.svg

[github]: https://github.com/req-json/req-json-rate-limit
[github-issues]: https://img.shields.io/github/issues/req-json/req-json-rate-limit.svg

[travis]: https://travis-ci.org/req-json/req-json-rate-limit
[travis-build]: https://travis-ci.org/req-json/req-json-rate-limit.svg?branch=master

[codecov]: https://codecov.io/gh/req-json/rate-limit
[codecov-svg]: https://img.shields.io/codecov/c/github/req-json/rate-limit.svg
