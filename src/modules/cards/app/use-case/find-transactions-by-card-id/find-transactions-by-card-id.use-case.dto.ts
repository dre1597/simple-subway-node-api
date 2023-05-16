export type FindTransactionsByCardIdUseCaseInputDto = {
  cardId: number;
};

export type FindTransactionsByCardIdUseCaseOutputDto = {
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
