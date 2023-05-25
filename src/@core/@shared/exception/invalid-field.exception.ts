import { CustomException } from './custom.exception';
import { HttpStatusCode } from '../utils/http-status-code.enum';

export class InvalidFieldException extends CustomException {
  constructor(field: string, message: string) {
    super(
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      'InvalidFieldException',
      `Invalid field: ${field}, details: ${message}`,
    );
  }
}
