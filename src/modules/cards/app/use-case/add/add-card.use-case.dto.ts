export type AddCardUseCaseInputDto = {
  name: string;
  balance?: number;
};

export type AddCardUseCaseOutputDto = {
  id: number;
  name: string;
  balance: number;
};
