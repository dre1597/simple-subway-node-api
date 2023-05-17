export type AddCardInputDto = {
  name: string;
};

export type UpdateCardInputDto = {
  id: number;
  name?: string;
};

export type FindTransactionsByCardIdInputDto = {
  cardId: number;
};

export type FindTransactionsByCardIdOutputDto = {
  transactions: {
    id: number;
    card: {
      id: number;
      name: string;
      balance: number;
    };
    amount: number;
    timestamp: Date;
  }[];
};

export interface CardFacadeInterface {
  add(input: AddCardInputDto): Promise<void>;

  update(input: UpdateCardInputDto): Promise<void>;

  findTransactionsByCardId(
    input: FindTransactionsByCardIdInputDto,
  ): Promise<FindTransactionsByCardIdOutputDto>;
}
