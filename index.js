import serializeRequest from '@req-json/serialize-request';

function getCachedProperty(ctx) {
  return {
    response: ctx.response,
    status: ctx.status,
    header: ctx.header,
  };
}

function setCachedProperty(ctx, newCtx) {
  ctx.response = newCtx.response;
  ctx.status = newCtx.status;
  ctx.header = newCtx.header;
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
      if (rateLimitCache[request].c) {
        setCachedProperty(ctx, rateLimitCache[request].c);
        if (rateLimitCache[request].e) {
          throw rateLimitCache[request].e;
        }
        return;
      }
      setCachedProperty(ctx, await new Promise((res, rej) => {
        rateLimitCache[request].res.push(res);
        rateLimitCache[request].rej.push(rej);
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
        rateLimitCache[request].c = getCachedProperty(context);
        rateLimitCache[request].e = err;
        rateLimitCache[request][err ? 'rej' : 'res'].forEach((r) => {
          r(err || getCachedProperty(context));
        });
        if (!rateLimitCache[request].t) {
          delete rateLimitCache[request];
        }
      }
    };
    try {
      await next();
    } catch (e) {
      onFinish(e);
      throw e;
    }
    onFinish(false, ctx);
  };
}
