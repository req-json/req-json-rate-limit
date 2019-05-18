import mock from 'xhr-mock';
import ReqJSON from 'req-json';
import reqJSONRateLimit from '../index';

beforeEach(() => mock.setup());

afterEach(() => mock.teardown());

it('rate limit', async () => {
  const reqJSON = new ReqJSON();
  const resource = reqJSON.resource('/api/item/:id');
  const body = {
    name: 1,
  };
  const fn = jest.fn();

  reqJSON.use(reqJSONRateLimit());

  mock.put('/api/item/1', (req, res) => {
    fn();
    return res
      .status(200)
      .headers({
        'Content-Type': 'application/json',
      })
      .body(JSON.stringify(body));
  });

  expect(await resource.put({
    id: 1,
  })).toEqual(await resource.put({
    id: 1,
  }));
  expect(fn).toHaveBeenCalledTimes(1);
});

it('no limit on other methods', async () => {
  const reqJSON = new ReqJSON();
  const resource = reqJSON.resource('/api/item/:id');
  const body = {
    name: 1,
  };
  const fn = jest.fn();

  reqJSON.use(reqJSONRateLimit({
    methods: ['PUT'],
  }));

  mock.get('/api/item/1', (req, res) => {
    fn();
    return res
      .status(200)
      .headers({
        'Content-Type': 'application/json',
      })
      .body(JSON.stringify(body));
  });

  expect(await resource.get({
    id: 1,
  })).toEqual(await resource.get({
    id: 1,
  }));
  expect(fn).toHaveBeenCalledTimes(2);
});

it('no limit on exceed time limit', async () => {
  const reqJSON = new ReqJSON();
  const resource = reqJSON.resource('/api/item/:id');
  const body = {
    name: 1,
  };
  const fn = jest.fn();

  reqJSON.use(reqJSONRateLimit({
    frequency: 5,
  }));

  mock.put('/api/item/1', (req, res) => {
    fn();
    return res
      .status(200)
      .headers({
        'Content-Type': 'application/json',
      })
      .body(JSON.stringify(body));
  });

  expect(await resource.put({
    id: 1,
  })).toEqual(await new Promise((resolve) => {
    setTimeout(resolve, 10);
  })
    .then(() => resource.put({
      id: 1,
    })));
  expect(fn).toHaveBeenCalledTimes(2);
});

it('resolves undefined response', async () => {
  const reqJSON = new ReqJSON();
  const resource = reqJSON.resource('/api/item/:id');
  const fn = jest.fn();

  reqJSON.use(reqJSONRateLimit({
    frequency: 5,
  }));

  reqJSON.use(async (ctx, next) => {
    await next();
    ctx.response = undefined;
  });

  mock.put('/api/item/1', (req, res) => {
    fn();
    return res
      .status(204);
  });

  expect(await resource.put({
    id: 1,
  })).toEqual(await resource.put({
    id: 1,
  }));
  expect(fn).toHaveBeenCalledTimes(1);
});
