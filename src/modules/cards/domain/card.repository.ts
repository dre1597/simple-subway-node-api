import { Card } from './card';

export type SaveCardInputDto = {
  card: Card;
};

export type SaveCardOutputDto = {
  card: Card;
};

export interface CardRepository {
  save(input: SaveCardInputDto): Promise<SaveCardOutputDto>;
}
