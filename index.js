import serializeRequest from '@req-json/serialize-request';
import asyncThrottleCache from 'async-throttle-cache';

function clone(obj) {
  if (obj == null) {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}

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
        ctx.response = clone(newCtx.response);
        ctx.status = newCtx.status;
        ctx.header = clone(newCtx.header);
      });
  };
}
