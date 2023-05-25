import { object, string } from 'yup';

import {
  MAX_STATION_LINE_LENGTH,
  MAX_STATION_NAME_LENGTH,
  MIN_STATION_LINE_LENGTH,
  MIN_STATION_NAME_LENGTH,
} from '#station/domain/station';

const addStationSchema = object({
  name: string()
    .trim()
    .required()
    .min(MIN_STATION_NAME_LENGTH)
    .max(MAX_STATION_NAME_LENGTH),
  line: string()
    .trim()
    .required()
    .min(MIN_STATION_LINE_LENGTH)
    .max(MAX_STATION_LINE_LENGTH),
});

export class AddStationValidator {
  public static async validate(name: string, line: string): Promise<void> {
    await addStationSchema.validate({ name, line });
  }
}
