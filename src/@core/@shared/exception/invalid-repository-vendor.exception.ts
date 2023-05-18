import { CustomException } from './custom.exception';

export class InvalidRepositoryVendorException extends CustomException {
  constructor() {
    super(
      500,
      'InvalidRepositoryVendorException',
      'Invalid repository vendor configuration',
    );
  }
}
