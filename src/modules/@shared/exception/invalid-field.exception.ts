export class InvalidFieldException extends Error {
  constructor(field: string, message: string) {
    super(`Invalid field: ${field}, details: ${message}`);
    this.name = 'InvalidFieldException';
  }
}
