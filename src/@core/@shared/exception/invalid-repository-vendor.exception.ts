import { CustomException } from './custom.exception';
import { HttpStatusCode } from '../utils/http-status-code.enum';

export class InvalidRepositoryVendorException extends CustomException {
  constructor() {
    super(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      'InvalidRepositoryVendorException',
      'Invalid repository vendor configuration',
    );
  }
}
