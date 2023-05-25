import { CustomException } from './custom.exception';
import { HttpStatusCode } from '../utils/http-status-code.enum';

export class UniqueFieldException extends CustomException {
  constructor(field: string, message: string) {
    super(
      HttpStatusCode.CONFLICT,
      'UniqueFieldException',
      `Unique field: ${field}, details: ${message}`,
    );
  }
}
