import { StationController } from './station.controller';

const mockFacade = {
  add: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  removeAll: vi.fn(),
  restoreAll: vi.fn(),
};

const makeSut = (facade = mockFacade) => {
  return new StationController(facade);
};

describe('StationController', () => {
  describe('Add', () => {
    it('should add card', async () => {
      const sut = makeSut();

      await sut.add('any_name', 'any_line');

      expect(mockFacade.add).toHaveBeenCalledWith({
        name: 'any_name',
        line: 'any_line',
      });
    });

    it('should throw when use case throws', async () => {
      const facade = {
        add: vi.fn().mockRejectedValueOnce(new Error()),
        findAll: vi.fn(),
        findById: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        removeAll: vi.fn(),
        restoreAll: vi.fn(),
      };

      const sut = makeSut(facade);

      await expect(
        async () => await sut.add('any_name', 'any_line'),
      ).rejects.toThrow();
    });
  });

  describe('FindAll', () => {
    it('should find all stations', async () => {
      const sut = makeSut();

      await sut.findAll();

      expect(mockFacade.findAll).toHaveBeenCalled();
    });

    it('should throw when use case throws', async () => {
      const facade = {
        add: vi.fn(),
        findAll: vi.fn().mockRejectedValueOnce(new Error()),
        findById: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        removeAll: vi.fn(),
        restoreAll: vi.fn(),
      };

      const sut = makeSut(facade);

      await expect(async () => await sut.findAll()).rejects.toThrow();
    });
  });

  describe('FindById', () => {
    it('should find station by id', async () => {
      const sut = makeSut();

      await sut.findById(1);

      expect(mockFacade.findById).toHaveBeenCalledWith({
        id: 1,
      });
    });

    it('should throw when use case throws', async () => {
      const facade = {
        add: vi.fn(),
        findAll: vi.fn(),
        findById: vi.fn().mockRejectedValueOnce(new Error()),
        update: vi.fn(),
        remove: vi.fn(),
        removeAll: vi.fn(),
        restoreAll: vi.fn(),
      };

      const sut = makeSut(facade);

      await expect(async () => await sut.findById(1)).rejects.toThrow();
    });
  });

  describe('Update', () => {
    it('should update card', async () => {
      const sut = makeSut();

      await sut.update(1, 'any_name', 'any_line');

      expect(mockFacade.update).toHaveBeenCalledWith({
        id: 1,
        name: 'any_name',
        line: 'any_line',
      });
    });

    it('should throw when use case throws', async () => {
      const facade = {
        add: vi.fn(),
        findAll: vi.fn(),
        findById: vi.fn(),
        update: vi.fn().mockRejectedValueOnce(new Error()),
        remove: vi.fn(),
        removeAll: vi.fn(),
        restoreAll: vi.fn(),
      };

      const sut = makeSut(facade);

      await expect(
        async () => await sut.update(1, 'any_name', 'any_line'),
      ).rejects.toThrow();
    });
  });

  describe('Remove', () => {
    it('should remove card', async () => {
      const sut = makeSut();

      await sut.remove(1);

      expect(mockFacade.remove).toHaveBeenCalledWith({
        id: 1,
      });
    });

    it('should throw when use case throws', async () => {
      const facade = {
        add: vi.fn(),
        findAll: vi.fn(),
        findById: vi.fn(),
        update: vi.fn(),
        remove: vi.fn().mockRejectedValueOnce(new Error()),
        removeAll: vi.fn(),
        restoreAll: vi.fn(),
      };

      const sut = makeSut(facade);

      await expect(async () => await sut.remove(1)).rejects.toThrow();
    });
  });

  describe('RemoveAll', () => {
    it('should remove all cards', async () => {
      const sut = makeSut();

      await sut.removeAll();

      expect(mockFacade.removeAll).toHaveBeenCalled();
    });

    it('should throw when use case throws', async () => {
      const facade = {
        add: vi.fn(),
        findAll: vi.fn(),
        findById: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        removeAll: vi.fn().mockRejectedValueOnce(new Error()),
        restoreAll: vi.fn(),
      };

      const sut = makeSut(facade);

      await expect(async () => await sut.removeAll()).rejects.toThrow();
    });
  });

  describe('RestoreAll', () => {
    it('should restore all cards', async () => {
      const sut = makeSut();

      await sut.restoreAll();

      expect(mockFacade.restoreAll).toHaveBeenCalled();
    });

    it('should throw when use case throws', async () => {
      const facade = {
        add: vi.fn(),
        findAll: vi.fn(),
        findById: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        removeAll: vi.fn(),
        restoreAll: vi.fn().mockRejectedValueOnce(new Error()),
      };

      const sut = makeSut(facade);

      await expect(async () => await sut.restoreAll()).rejects.toThrow();
    });
  });
});
