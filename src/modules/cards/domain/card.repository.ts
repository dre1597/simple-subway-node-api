import { Card } from './card';

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

export interface CardRepository {
  save(input: SaveCardInputDto): Promise<SaveCardOutputDto>;

  findById(input: FindCardByIdInputDto): Promise<FindCardByIdOutputDto>;
}
