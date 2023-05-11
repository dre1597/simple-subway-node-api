export class NotFoundException extends Error {
  constructor(entityName: string, message: string) {
    super(`Item not found: ${entityName}, details: ${message}`);
    this.name = 'NotFoundException';
  }
}
