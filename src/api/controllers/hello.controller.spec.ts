import { HelloController } from './hello.controller';

const makeSut = () => {
  return new HelloController();
};

describe('HelloController', () => {
  it('should return hello world', () => {
    const sut = makeSut();

    expect(sut.get()).toEqual({ hello: 'world' });
  });
});
