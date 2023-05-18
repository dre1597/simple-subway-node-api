import { number, object, string } from 'yup';

const updateCardSchema = object({
  name: string().trim().min(3).max(32).notRequired(),
  balance: number().notRequired(),
});

export class UpdateCardValidator {
  public static async validate(name?: string, balance?: number): Promise<void> {
    await updateCardSchema.validate({ name, balance });
  }
}
