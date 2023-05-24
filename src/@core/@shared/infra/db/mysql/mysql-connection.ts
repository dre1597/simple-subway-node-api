import mysql from 'mysql2';
import { config } from 'dotenv';

config();

const connectionConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database:
    process.env.NODE_ENV === 'test'
      ? process.env.DB_DATABASE_TEST
      : process.env.DB_DATABASE,
};

export class MySQLConnection {
  private static instance: MySQLConnection;
  public connection: mysql.Connection;

  private constructor(database?: string) {
    if (database) {
      connectionConfig.database = database;
    }

    this.connection = mysql.createConnection(connectionConfig);

    this.connection.connect((err) => {
      if (err) {
        console.error('Error connecting to MySQL' + err.stack);
        throw new Error('Error connecting to MYSQL');
      }
    });
  }

  public static getInstance(database?: string): MySQLConnection {
    if (!MySQLConnection.instance) {
      MySQLConnection.instance = new MySQLConnection(database);
    }
    return MySQLConnection.instance;
  }

  public query(statement: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(statement, params, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }

  public close(): void {
    this.connection.destroy();

    MySQLConnection.instance = null;
    this.connection = null;
  }
}
