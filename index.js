import serializeRequest from '@req-json/serialize-request';

const {
  stringify,
  parse,
} = JSON;

function getCachedProperty(ctx) {
  return {
    response: stringify(ctx.response),
    status: ctx.status,
    header: stringify(ctx.header),
  };
}

function setCachedProperty(ctx, newCtx) {
  ctx.response = parse(newCtx.response);
  ctx.status = newCtx.status;
  ctx.header = parse(newCtx.header);
}

export default function (options = {}) {
  if (!options.methods) {
    options.methods = [
      'POST',
      'PUT',
    ];
  }
  if (!options.frequency) {
    options.frequency = 1000;
  }
  const rateLimitCache = {};
  return async function rateLimit(ctx, next) {
    if (options.methods.indexOf(ctx.method) < 0) {
      await next();
      return;
    }
    const request = serializeRequest(ctx);
    if (rateLimitCache[request]) {
      const cached = rateLimitCache[request];
      const {
        c,
        e,
      } = cached;
      if (c) {
        setCachedProperty(ctx, c);
        if (e) {
          throw e;
        }
        return;
      }
      setCachedProperty(ctx, await new Promise((res, rej) => {
        cached.res.push(res);
        cached.rej.push(rej);
      }));
      return;
    }
    rateLimitCache[request] = {
      res: [],
      rej: [],
      t: setTimeout(() => {
        if (rateLimitCache[request].c) {
          delete rateLimitCache[request];
        } else {
          rateLimitCache[request].t = 0;
        }
      }, options.frequency),
    };
    const onFinish = (err, context) => {
      if (rateLimitCache[request]) {
        const cached = rateLimitCache[request];
        const c = cached.c = getCachedProperty(context);
        cached.e = err;
        cached[err ? 'rej' : 'res'].forEach((r) => {
          r(err || c);
        });
        if (!cached.t) {
          delete rateLimitCache[request];
        }
      }
    };
    try {
      await next();
    } catch (e) {
      onFinish(e, ctx);
      throw e;
    }
    onFinish(false, ctx);
  };
}
