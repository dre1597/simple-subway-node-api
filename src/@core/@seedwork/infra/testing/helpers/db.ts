import { MySQLConnection } from '#shared/infra/db/mysql/mysql-connection';

export function setupMySQL(module: 'stations' | 'cards') {
  const _connection = MySQLConnection.getInstance();

  const truncateTables = async () => {
    const database = process.env.DB_DATABASE_TEST;

    if (module === 'stations') {
      await _connection.query(`TRUNCATE TABLE \`${database}\`.\`stations\``);
    } else if (module === 'cards') {
      await _connection.query('SET FOREIGN_KEY_CHECKS = 0');
      await _connection.query(`TRUNCATE TABLE \`${database}\`.\`cards\``);
      await _connection.query(
        `TRUNCATE TABLE \`${database}\`.\`transactions\``,
      );
      await _connection.query('SET FOREIGN_KEY_CHECKS = 1');
    }
  };

  beforeEach(async () => {
    await truncateTables();
  });

  afterEach(async () => {
    await truncateTables();
  });

  return {
    get connection() {
      return _connection;
    },
  };
}
