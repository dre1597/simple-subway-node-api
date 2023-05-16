export type UpdateCardUseCaseInputDto = {
  id: number;
  name?: string;
  balance?: number;
};

export type UpdateCardUseCaseOutputDto = {
  id: number;
  name: string;
  balance: number;
};
