# @req-json/rate-limit

[![npm][badge-version]][npm]
[![bundle size][badge-size]][bundlephobia]
[![npm downloads][badge-downloads]][npm]
[![license][badge-license]][license]


[![github][badge-issues]][github]
[![travis][badge-build]][travis]
[![coverage][badge-coverage]][coveralls]


Rate limit middleware for [req-json][req-json].

## Installation

### NPM

```
npm install @req-json/rate-limit --save
```

```js
import ReqJSON from 'req-json';
import reqJSONRateLimit from '@req-json/rate-limit';

const reqJSON = new ReqJSON();
reqJSON.use(reqJSONRateLimit());
```

### Browser

Direct `<script>` include `window.reqJSONRateLimit`

```html
<script src="https://cdn.jsdelivr.net/npm/@req-json/rate-limit@1"></script>
```

## Options

Rate limit middleware options and defaults.

```js
reqJSON.use(reqJSONRateLimit({
  methods: [ // request methods to apply rate limit
    'POST',
    'PUT'
  ],
  frequency: 1000 // request only once in 1000ms
}));
```

[req-json]: https://github.com/Cweili/req-json

[badge-version]: https://img.shields.io/npm/v/@req-json%2Frate-limit.svg
[badge-downloads]: https://img.shields.io/npm/dt/@req-json%2Frate-limit.svg
[npm]: https://www.npmjs.com/package/@req-json/rate-limit

[badge-size]: https://img.shields.io/bundlephobia/minzip/@req-json%2Frate-limit.svg
[bundlephobia]: https://bundlephobia.com/result?p=@req-json%2Frate-limit

[badge-license]: https://img.shields.io/npm/l/@req-json%2Frate-limit.svg
[license]: https://github.com/req-json/req-json-rate-limit/blob/master/LICENSE

[badge-issues]: https://img.shields.io/github/issues/req-json/req-json-rate-limit.svg
[github]: https://github.com/req-json/req-json-rate-limit

[badge-build]: https://travis-ci.org/req-json/req-json-rate-limit.svg?branch=master
[travis]: https://travis-ci.org/req-json/req-json-rate-limit

[badge-coverage]: https://coveralls.io/repos/github/req-json/req-json-rate-limit/badge.svg?branch=master
[coveralls]: https://coveralls.io/github/req-json/req-json-rate-limit?branch=master
