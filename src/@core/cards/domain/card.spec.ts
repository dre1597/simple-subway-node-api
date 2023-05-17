import { describe, expect, it } from 'vitest';

import { Card, CreateCardInput } from './card';
import { InvalidFieldException } from '../../@shared/exception/invalid-field.exception';

describe('Card', () => {
  it('should be able to create a new card', () => {
    let input: CreateCardInput = {
      name: 'any_card1',
    };

    const card = new Card(input);

    expect(card.name).toBe(input.name);
    expect(card.balance).toBe(0);

    input = {
      id: 2,
      name: 'any_card2',
      balance: 10,
    };

    const cardWithId = new Card(input);

    expect(cardWithId.id).toBe(input.id);
    expect(cardWithId.name).toBe(input.name);
    expect(cardWithId.balance).toBe(input.balance);
  });

  it('should not be able to create a new card with invalid name', () => {
    const input = {
      name: '',
    };

    expect(() => new Card(input)).toThrowError(
      new InvalidFieldException(
        'name',
        'Name must be between 3 and 32 characters long',
      ),
    );
  });

  it('should be able to update a card', () => {
    const input: CreateCardInput = {
      name: 'any_name',
    };

    const card = new Card(input);

    expect(card.name).toBe(input.name);
    expect(card.balance).toBe(0);

    card.update({
      name: 'updated_name',
      balance: 10,
    });

    expect(card.name).toBe('updated_name');
    expect(card.balance).toBe(10);
  });

  it('should keep the name if it is not present', () => {
    const input: CreateCardInput = {
      name: 'any_name',
      balance: 10,
    };

    const card = new Card(input);

    expect(card.name).toBe(input.name);

    card.update({});

    expect(card.name).toBe(input.name);
    expect(card.balance).toBe(input.balance);
  });

  it('should not be able to update a card with invalid name', () => {
    const input: CreateCardInput = {
      name: 'any_name',
    };

    const card = new Card(input);

    expect(() =>
      card.update({
        name: '',
      }),
    ).toThrowError(
      new InvalidFieldException(
        'name',
        'Name must be between 3 and 32 characters long',
      ),
    );
  });
});
