import { Collection } from 'mongodb';

import {
  DeleteStationInputDto,
  FindAllStationsOutputDto,
  FindOneByIdStationInputDto,
  FindOneByNameStationInputDto,
  FindOneStationOutputDto,
  SaveStationInputDto,
  SaveStationOutputDto,
  StationRepository,
  VerifyNameAlreadyExistsInputDto,
  VerifyNameAlreadyExistsOutputDto,
} from '../../../domain/station.repository';
import { MongoHelper } from '../../../../@shared/infra/db/mongo/mongo-helper';
import { Station } from '../../../domain/station';
import { NotFoundException } from '../../../../@shared/exception/not-found.exception';

export class StationMongoRepository implements StationRepository {
  public async save(input: SaveStationInputDto): Promise<SaveStationOutputDto> {
    const collection = await this.getCollection();

    if (!input.station.id) {
      await this._insert(input, collection);
    } else {
      await this._update(input, collection);
    }

    return {
      station: new Station({
        id: input.station.id,
        name: input.station.name,
        line: input.station.line,
        isDeleted: input.station.isDeleted,
      }),
    };
  }

  public async findAll(): Promise<FindAllStationsOutputDto> {
    const collection = await this.getCollection();

    const stations = await collection
      .find({
        isDeleted: false,
      })
      .toArray();

    return {
      stations: stations.map(
        (station) =>
          new Station({
            id: station.stationId,
            name: station.name,
            line: station.line,
            isDeleted: station.isDeleted,
          }),
      ),
    };
  }

  public async findById(
    input: FindOneByIdStationInputDto,
  ): Promise<FindOneStationOutputDto> {
    const collection = await this.getCollection();

    const station = await collection.findOne({
      stationId: input.id,
      isDeleted: false,
    });

    if (!station) {
      throw new NotFoundException(
        'Station',
        `Station with id ${input.id} not found`,
      );
    }

    return {
      station: new Station({
        id: station.stationId,
        name: station.name,
        line: station.line,
        isDeleted: station.isDeleted,
      }),
    };
  }

  public async findByName(
    input: FindOneByNameStationInputDto,
  ): Promise<FindOneStationOutputDto> {
    const collection = await this.getCollection();

    const station = await collection.findOne({
      name: input.name,
    });

    if (!station) {
      throw new NotFoundException(
        'Station',
        `Station with name ${input.name} not found`,
      );
    }

    return {
      station: new Station({
        id: station.stationId,
        name: station.name,
        line: station.line,
        isDeleted: station.isDeleted,
      }),
    };
  }

  public async verifyNameAlreadyExists(
    input: VerifyNameAlreadyExistsInputDto,
  ): Promise<VerifyNameAlreadyExistsOutputDto> {
    const collection = await MongoHelper.getCollection('stations');

    let alreadyExists = false;

    const stationFound = await collection.findOne({
      name: input.name,
    });

    if (stationFound && stationFound.stationId !== input.id) {
      alreadyExists = true;
    }

    return {
      station: stationFound
        ? new Station({
            id: stationFound.stationId,
            name: stationFound.name,
            line: stationFound.line,
            isDeleted: stationFound.isDeleted,
          })
        : null,
      alreadyExists,
    };
  }

  public async delete(input: DeleteStationInputDto): Promise<void> {
    const collection = await this.getCollection();

    await collection.deleteOne({
      stationId: input.id,
    });
  }

  public async deleteAll(): Promise<void> {
    const collection = await this.getCollection();

    await collection.updateMany(
      {
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
        },
      },
    );
  }

  public async restoreAll(): Promise<void> {
    const collection = await this.getCollection();

    await collection.updateMany(
      {
        isDeleted: true,
      },
      {
        $set: {
          isDeleted: false,
        },
      },
    );
  }

  private async _insert(
    input: SaveStationInputDto,
    collection: Collection,
  ): Promise<void> {
    input.station.id = await this.getNextId();

    await collection.insertOne({
      stationId: input.station.id,
      name: input.station.name,
      line: input.station.line,
      isDeleted: input.station.isDeleted,
    });
  }

  private async _update(
    input: SaveStationInputDto,
    collection: Collection,
  ): Promise<void> {
    await collection.updateOne(
      {
        stationId: input.station.id,
      },
      {
        $set: {
          name: input.station.name,
          line: input.station.line,
          isDeleted: input.station.isDeleted,
        },
      },
    );
  }

  private async getCollection(): Promise<Collection> {
    return await MongoHelper.getCollection('stations');
  }

  private async getNextId(): Promise<number> {
    const collection = await this.getCollection();

    return (await collection.countDocuments()) + 1;
  }
}
