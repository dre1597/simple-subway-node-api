export type AddCardInputDto = {
  name: string;
};

export interface CardFacadeInterface {
  add(input: AddCardInputDto): Promise<void>;
}
