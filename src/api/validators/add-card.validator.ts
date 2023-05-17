import { object, string } from 'yup';

const addCardSchema = object({
  name: string().trim().required().min(3).max(32),
});

export class AddCardValidator {
  public static async validate(name: string): Promise<void> {
    await addCardSchema.validate({ name });
  }
}
