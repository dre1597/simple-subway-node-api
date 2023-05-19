import { object, string } from 'yup';

const updateStationSchema = object({
  name: string().trim().min(3).max(32).notRequired(),
  line: string().trim().min(3).max(32).notRequired(),
});

export class UpdateStationValidator {
  public static async validate(name?: string, line?: string): Promise<void> {
    await updateStationSchema.validate({ name, line });
  }
}
