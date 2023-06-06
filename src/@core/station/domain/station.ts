import { InvalidFieldException } from '#shared/domain/exception/invalid-field.exception';

export type CreateStationInput = {
  id?: number;
  name: string;
  line: string;
  isDeleted?: boolean;
};

export type UpdateStationInput = {
  name?: string;
  line?: string;
};

export const MIN_STATION_NAME_LENGTH = 3;
export const MAX_STATION_NAME_LENGTH = 32;
export const MIN_STATION_LINE_LENGTH = 3;
export const MAX_STATION_LINE_LENGTH = 32;

export class Station {
  private _id: number;
  private _name: string;
  private _line: string;
  private _isDeleted: boolean;

  constructor(input: CreateStationInput) {
    this._name = input.name;
    this._line = input.line;
    this._id = input.id;
    this._isDeleted = input.isDeleted ?? false;
    this._validate();
  }

  public get id(): number {
    return this._id;
  }

  public set id(value: number) {
    this._id = value;
  }

  public get name(): string {
    return this._name;
  }

  public get line(): string {
    return this._line;
  }

  public get isDeleted(): boolean {
    return this._isDeleted;
  }

  public update(input: UpdateStationInput): void {
    this._name = input.name ?? this._name;
    this._line = input.line ?? this._line;
    this._validate();
  }

  public delete(): void {
    this._isDeleted = true;
  }

  public restore(): void {
    this._isDeleted = false;
  }

  private _validate(): boolean {
    if (
      this._name.length < MIN_STATION_NAME_LENGTH ||
      this._name.length > MAX_STATION_NAME_LENGTH
    ) {
      throw new InvalidFieldException(
        'name',
        `Name must be between ${MIN_STATION_NAME_LENGTH} and ${MAX_STATION_NAME_LENGTH} characters long`,
      );
    }

    if (
      this._line.length < MIN_STATION_LINE_LENGTH ||
      this._line.length > MAX_STATION_LINE_LENGTH
    ) {
      throw new InvalidFieldException(
        'line',
        `Line must be between ${MIN_STATION_LINE_LENGTH} and ${MAX_STATION_LINE_LENGTH} characters long`,
      );
    }

    return true;
  }
}
