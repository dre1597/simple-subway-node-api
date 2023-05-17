export class InternalServerErrorException extends Error {
  constructor() {
    super('Internal server error');
    this.name = 'InternalServerErrorException';
  }
}
