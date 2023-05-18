import { object, string } from 'yup';

const addStationSchema = object({
  name: string().trim().required().min(3).max(32),
  line: string().trim().required().min(3).max(32),
});

export class AddStationValidator {
  public static async validate(name: string, line: string): Promise<void> {
    await addStationSchema.validate({ name, line });
  }
}
