import { InvalidFieldException } from '../../@shared/exception/invalid-field.exception';

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
