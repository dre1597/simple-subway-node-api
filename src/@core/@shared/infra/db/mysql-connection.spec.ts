import { MySQLConnection } from './mysql-connection';

describe('MysqlConnection', () => {
  it('should be able to create a connection', async () => {
    const mySQLConnection = MySQLConnection.getInstance();

    expect(mySQLConnection).toBeInstanceOf(MySQLConnection);

    const result = await new Promise((resolve, reject) => {
      mySQLConnection.connection.connect((err) => {
        if (err) {
          reject(false);
        } else {
          resolve(true);
        }
      });
    });

    expect(result).toBeTruthy();

    let select = await mySQLConnection.query('SELECT 1 + 1 AS solution');
    expect(select[0].solution).toBe(2);

    select = await mySQLConnection.query('SELECT 1 - 1 AS solution');
    expect(select[0].solution).toBe(0);

    await mySQLConnection.close();

    await expect(async () => {
      await mySQLConnection.query('SELECT 1 + 1 AS solution');
    }).rejects.toThrow();
  });
});
