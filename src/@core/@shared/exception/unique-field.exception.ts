import { CustomException } from './custom.exception';

export class UniqueFieldException extends CustomException {
  constructor(field: string, message: string) {
    super(
      409,
      'UniqueFieldException',
      `Unique field: ${field}, details: ${message}`,
    );
  }
}
