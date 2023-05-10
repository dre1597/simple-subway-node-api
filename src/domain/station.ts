import { InvalidFieldException } from './invalid-field.exception';

export type CreateStationInput = {
  id?: number;
  name: string;
  line: string;
};

export class Station {
  private _id: number;
  private _name: string;
  private _line: string;

  constructor({ id, name, line }: CreateStationInput) {
    this._name = name;
    this._line = line;
    this._id = id;
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

  private _validate(): boolean {
    if (this._name.length < 3 || this._name.length > 32) {
      throw new InvalidFieldException(
        'name',
        'Name must be between 3 and 32 characters long',
      );
    }

    if (this._line.length < 3 || this._line.length > 32) {
      throw new InvalidFieldException(
        'line',
        'Line must be between 3 and 32 characters long',
      );
    }

    return true;
  }
}
