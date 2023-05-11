import { InvalidFieldException } from '../../@shared/exception/domain/invalid-field.exception';

export type CreateStationInput = {
  id?: number;
  name: string;
  line: string;
};

export class Station {
  private _id: number;
  private _name: string;
  private _line: string;

  constructor(input: CreateStationInput) {
    this._name = input.name;
    this._line = input.line;
    this._id = input.id;
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

  public update(input: CreateStationInput): void {
    this._name = input.name;
    this._line = input.line;
    this._validate();
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
