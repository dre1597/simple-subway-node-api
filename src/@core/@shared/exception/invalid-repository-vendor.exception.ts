export class InvalidRepositoryVendorException extends Error {
  constructor() {
    super('Invalid repository vendor configuration');
    this.name = 'InvalidRepositoryVendorException';
  }
}
