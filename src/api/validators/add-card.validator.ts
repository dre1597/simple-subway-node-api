import { number, object, string } from 'yup';

import { MAX_CARD_NAME_LENGTH, MIN_CARD_NAME_LENGTH } from '#card/domain/card';

const addCardSchema = object({
  name: string()
    .trim()
    .required()
    .min(MIN_CARD_NAME_LENGTH)
    .max(MAX_CARD_NAME_LENGTH),
  balance: number().optional(),
});

export class AddCardValidator {
  public static async validate(name: string, balance?: number): Promise<void> {
    await addCardSchema.validate({ name, balance });
  }
}
