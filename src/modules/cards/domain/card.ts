import { InvalidFieldException } from '../../@shared/exception/invalid-field.exception';

export type CreateCardInput = {
  id?: number;
  name: string;
};

export class Card {
  private _id: number;
  private _name: string;

  constructor(input: CreateCardInput) {
    this._name = input.name;
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

  private _validate(): boolean {
    if (this._name.length < 3 || this._name.length > 32) {
      throw new InvalidFieldException(
        'name',
        'Name must be between 3 and 32 characters long',
      );
    }

    return true;
  }
}
