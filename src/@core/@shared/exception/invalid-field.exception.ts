import { HttpStatusCode } from '../utils/http-status-code.enum';
import { CustomException } from './custom.exception';

export class InvalidFieldException extends CustomException {
  constructor(field: string, message: string) {
    super(
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      'InvalidFieldException',
      `Invalid field: ${field}, details: ${message}`,
    );
  }
}
