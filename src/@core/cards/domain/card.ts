import { InvalidFieldException } from '../../@shared/exception/invalid-field.exception';

export type CreateCardInput = {
  id?: number;
  name: string;
  balance?: number;
};

export type UpdateCardInput = {
  name?: string;
  balance?: number;
};

export const MIN_CARD_NAME_LENGTH = 3;
export const MAX_CARD_NAME_LENGTH = 32;

export class Card {
  private _id: number;
  private _name: string;
  private _balance: number;

  constructor(input: CreateCardInput) {
    this._id = input.id;
    this._name = input.name;
    this._balance = input.balance ?? 0;

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

  public get balance(): number {
    return this._balance;
  }

  public update(input: UpdateCardInput): void {
    this._name = input.name ?? this._name;
    this._balance = input.balance ?? this._balance;
    this._validate();
  }

  private _validate(): boolean {
    if (
      this._name.length < MIN_CARD_NAME_LENGTH ||
      this._name.length > MAX_CARD_NAME_LENGTH
    ) {
      throw new InvalidFieldException(
        'name',
        `Name must be between ${MIN_CARD_NAME_LENGTH} and ${MAX_CARD_NAME_LENGTH} characters long`,
      );
    }

    return true;
  }
}
