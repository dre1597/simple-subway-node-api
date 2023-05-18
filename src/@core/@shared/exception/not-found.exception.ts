import { CustomException } from './custom.exception';

export class NotFoundException extends CustomException {
  constructor(entityName: string, message: string) {
    super(
      404,
      'NotFoundException',
      `Item not found: ${entityName}, details: ${message}`,
    );
  }
}
