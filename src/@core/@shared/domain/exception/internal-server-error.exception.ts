import { HttpStatusCode } from '#shared/app/utils/http-status-code.enum';

import { CustomException } from './custom.exception';

export class InternalServerErrorException extends CustomException {
  constructor() {
    super(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      'InternalServerErrorException',
      'Internal Server Error',
    );
  }
}
