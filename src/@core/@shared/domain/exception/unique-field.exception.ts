import { HttpStatusCode } from '#shared/app/utils/http-status-code.enum';

import { CustomException } from './custom.exception';

export class UniqueFieldException extends CustomException {
  constructor(field: string, message: string) {
    super(
      HttpStatusCode.CONFLICT,
      'UniqueFieldException',
      `Unique field: ${field}, details: ${message}`,
    );
  }
}
