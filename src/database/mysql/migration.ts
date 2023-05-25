import fs from 'fs';

import { MySQLConnection } from '#shared/infra/db/mysql/mysql-connection';

export class MySQLMigration {
  public async run(): Promise<void> {
    const databaseName = process.argv[1];

    const connection = MySQLConnection.getInstance(databaseName);

    const migrations = fs.readdirSync(`${__dirname}/../../../migrations`);

    for (const migration of migrations) {
      const [timestamp, ...rest] = migration.split('-');

      const migrationName = rest.join('-').replace('.sql', '');

      if (timestamp === '0') {
        const script = fs.readFileSync(
          `${__dirname}/../../../migrations/${migration}`,
          'utf8',
        );

        await connection.query(script);

        continue;
      }

      const migrationExists = await connection.query(
        'SELECT timestamp FROM migrations WHERE timestamp = ?',
        [timestamp],
      );

      if (migrationExists.length > 0) {
        continue;
      }

      const script = fs.readFileSync(
        `${__dirname}/../../../migrations/${migration}`,
        'utf8',
      );

      await connection.query(script);

      await connection.query(
        'INSERT INTO `migrations` (timestamp, name) VALUES (?, ?)',
        [timestamp, migrationName],
      );
      console.info(`Migration ${migrationName} executed`);
    }
    connection.close();
    console.info('Migrations executed');
  }

  public create(): void {
    const migrationName = process.argv[1];

    if (!migrationName) {
      throw new Error('Name is required');
    }

    const timestampNow = new Date().getTime();

    fs.writeFileSync(
      `${__dirname}/../../../migrations/${timestampNow}-${migrationName}.sql`,
      '',
      'utf8',
    );
  }
}
