import serializeRequest from '@req-json/serialize-request';
import asyncThrottleCache from 'async-throttle-cache';

const {
  stringify,
  parse,
} = JSON;

export default function ({
  methods = [
    'POST',
    'PUT',
  ],
  frequency = 1000,
} = {}) {
  const rateLimitThrottle = asyncThrottleCache((ctx, next) => next().then(() => ctx), frequency, {
    key: serializeRequest,
  });
  return function rateLimit(ctx, next) {
    if (methods.indexOf(ctx.method) < 0) {
      return next();
    }
    return rateLimitThrottle(ctx, next)
      .then((newCtx) => {
        ctx.response = parse(stringify(newCtx.response));
        ctx.status = newCtx.status;
        ctx.header = parse(stringify(newCtx.header));
      });
  };
}
