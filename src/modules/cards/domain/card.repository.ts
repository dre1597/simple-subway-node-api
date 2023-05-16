import { Card } from './card';
import { Transaction } from './transaction';

export type SaveCardInputDto = {
  card: Card;
};

export type SaveCardOutputDto = {
  card: Card;
};

export type FindCardByIdInputDto = {
  id: number;
};

export type FindCardByIdOutputDto = {
  card: Card;
};

export type FindTransactionsByCardIdInputDto = {
  cardId: number;
};

export type FindTransactionsByCardIdOutputDto = {
  transactions: Transaction[];
};

export interface CardRepository {
  save(input: SaveCardInputDto): Promise<SaveCardOutputDto>;

  findById(input: FindCardByIdInputDto): Promise<FindCardByIdOutputDto>;

  findTransactionsByCardId(
    input: FindTransactionsByCardIdInputDto,
  ): Promise<FindTransactionsByCardIdOutputDto>;
}
