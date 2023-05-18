import { number, object, string } from 'yup';

const addCardSchema = object({
  name: string().trim().required().min(3).max(32),
  balance: number().optional(),
});

export class AddCardValidator {
  public static async validate(name: string, balance?: number): Promise<void> {
    await addCardSchema.validate({ name, balance });
  }
}
