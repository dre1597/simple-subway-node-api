import { describe, expect, it } from 'vitest';

import { CardInMemoryRepository } from './card.in-memory.repository';
import { Card, CreateCardInput } from '../../../domain/card';

const makeSut = () => new CardInMemoryRepository();

describe('CardInMemoryRepository', () => {
  it('should insert a card', async () => {
    const repository = makeSut();

    const props: CreateCardInput = {
      name: 'any_name1',
    };

    let card = new Card(props);

    const { card: cardInserted } = await repository.save({
      card,
    });

    expect(cardInserted.id).toBe(1);
    expect(cardInserted.name).toBe(props.name);

    props.name = 'any_name2';

    card = new Card(props);

    const { card: cardInserted2 } = await repository.save({
      card,
    });

    expect(cardInserted2.id).toBe(2);
    expect(cardInserted2.name).toBe(props.name);
  });
});
