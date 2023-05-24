import { Collection, MongoClient } from 'mongodb';
import { config } from 'dotenv';

config();

const connectionURI =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI;

export class MongoHelper {
  private static _client: MongoClient | null;

  public static async connect(): Promise<void> {
    this._client = await MongoClient.connect(connectionURI);
  }

  public static async getCollection(name: string): Promise<Collection> {
    if (!this._client) {
      await this.connect();
    }

    return this._client.db().collection(name);
  }

  public static async disconnect(): Promise<void> {
    await this._client.close();
    this._client = null;
  }
}
