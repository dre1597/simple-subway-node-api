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
      ? process.env.DB_BASEBASE_TEST
      : process.env.DB_DATABASE,
};

export class MySQLConnection {
  public static instance: MySQLConnection;
  public connection: mysql.Connection;

  private constructor() {
    this.connection = mysql.createConnection(connectionConfig);

    this.connection.connect((err) => {
      if (err) {
        console.error('Error connecting to MySQL' + err.stack);
      }
    });
  }

  public static getInstance(): MySQLConnection {
    if (!MySQLConnection.instance) {
      MySQLConnection.instance = new MySQLConnection();
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
    return this.connection.destroy();
  }
}
