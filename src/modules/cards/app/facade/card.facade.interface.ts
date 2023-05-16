export type AddCardInputDto = {
  name: string;
};

export type UpdateCardInputDto = {
  id: number;
  name?: string;
};

export interface CardFacadeInterface {
  add(input: AddCardInputDto): Promise<void>;

  update(input: UpdateCardInputDto): Promise<void>;
}
