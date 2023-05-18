import { CustomException } from './custom.exception';

export class InternalServerErrorException extends CustomException {
  constructor() {
    super(500, 'InternalServerErrorException', 'Internal Server Error');
  }
}
