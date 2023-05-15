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

    input = {
      id: 2,
      name: 'any_card2',
    };

    const cardWithId = new Card(input);

    expect(cardWithId.id).toBe(input.id);
    expect(cardWithId.name).toBe(input.name);
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
});
