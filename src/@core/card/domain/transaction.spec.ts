import { Card } from './card';
import { CreateTransactionInput, Transaction } from './transaction';

describe('Transaction', () => {
  it('should be able to create a new transaction', () => {
    const card = new Card({
      name: 'any_name',
    });

    const input: CreateTransactionInput = {
      id: 1,
      card,
      amount: 1,
      timestamp: new Date(),
    };

    const transaction = new Transaction(input);

    expect(transaction.id).toBe(input.id);
    expect(transaction.card).toEqual(input.card);
    expect(transaction.amount).toBe(input.amount);
    expect(transaction.timestamp).toBe(input.timestamp);
  });
});
