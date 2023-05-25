import { number, object, string } from 'yup';

import {
  MAX_CARD_NAME_LENGTH,
  MIN_CARD_NAME_LENGTH,
} from '../../@core/card/domain/card';

const updateCardSchema = object({
  name: string()
    .trim()
    .min(MIN_CARD_NAME_LENGTH)
    .max(MAX_CARD_NAME_LENGTH)
    .notRequired(),
  balance: number().notRequired(),
});

export class UpdateCardValidator {
  public static async validate(name?: string, balance?: number): Promise<void> {
    await updateCardSchema.validate({ name, balance });
  }
}
