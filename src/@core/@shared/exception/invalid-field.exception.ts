import { CustomException } from './custom.exception';

export class InvalidFieldException extends CustomException {
  constructor(field: string, message: string) {
    super(
      422,
      'InvalidFieldException',
      `Invalid field: ${field}, details: ${message}`,
    );
  }
}
