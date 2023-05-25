import { CustomException } from './custom.exception';
import { HttpStatusCode } from '../utils/http-status-code.enum';

export class InternalServerErrorException extends CustomException {
  constructor() {
    super(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      'InternalServerErrorException',
      'Internal Server Error',
    );
  }
}
