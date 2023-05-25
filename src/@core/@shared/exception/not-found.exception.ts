import { HttpStatusCode } from '../utils/http-status-code.enum';
import { CustomException } from './custom.exception';

export class NotFoundException extends CustomException {
  constructor(entityName: string, message: string) {
    super(
      HttpStatusCode.NOT_FOUND,
      'NotFoundException',
      `Item not found: ${entityName}, details: ${message}`,
    );
  }
}
