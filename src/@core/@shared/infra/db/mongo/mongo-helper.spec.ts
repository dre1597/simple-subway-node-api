import { Collection } from 'mongodb';

import { MongoHelper } from './mongo-helper';

describe('MongoHelper', () => {
  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should be able to create a connection', async () => {
    await MongoHelper.connect();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(MongoHelper._client).toBeTruthy();
  });

  it('should be able to disconnect from the database', async () => {
    await MongoHelper.disconnect();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(MongoHelper._client).toBeNull();
  });

  it('should be able to get a collection', async () => {
    const collection = await MongoHelper.getCollection('subway_test');

    expect(collection).toBeInstanceOf(Collection);

    const result = await collection.find({}).toArray();

    expect(result).toEqual([]);
  });

  it('should be able to reconnect to get a collection if there is not connection', async () => {
    await MongoHelper.disconnect();

    const collection = await MongoHelper.getCollection('subway_test');

    expect(collection).toBeInstanceOf(Collection);

    const result = await collection.find({}).toArray();

    expect(result).toEqual([]);
  });
});
