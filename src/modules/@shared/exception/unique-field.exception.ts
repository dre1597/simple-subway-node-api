export class UniqueFieldException extends Error {
  constructor(field: string, message: string) {
    super(`Unique field: ${field}, details: ${message}`);
    this.name = 'UniqueFieldException';
  }
}
