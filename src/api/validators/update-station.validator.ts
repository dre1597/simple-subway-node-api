import { object, string } from 'yup';

import {
  MAX_STATION_LINE_LENGTH,
  MAX_STATION_NAME_LENGTH,
  MIN_STATION_LINE_LENGTH,
  MIN_STATION_NAME_LENGTH,
} from '#station/domain/station';

const updateStationSchema = object({
  name: string()
    .trim()
    .min(MIN_STATION_NAME_LENGTH)
    .max(MAX_STATION_NAME_LENGTH)
    .notRequired(),
  line: string()
    .trim()
    .min(MIN_STATION_LINE_LENGTH)
    .max(MAX_STATION_LINE_LENGTH)
    .notRequired(),
});

export class UpdateStationValidator {
  public static async validate(name?: string, line?: string): Promise<void> {
    await updateStationSchema.validate({ name, line });
  }
}
