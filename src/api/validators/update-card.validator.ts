import { object, string } from 'yup';

const updateCardSchema = object({
  name: string().trim().required().min(3).max(32),
});

export class UpdateCardValidator {
  public static async validate(name: string): Promise<void> {
    if (name !== undefined) {
      await updateCardSchema.validate({ name });
    }
  }
}
