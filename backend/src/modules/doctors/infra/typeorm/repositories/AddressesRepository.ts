import CreateAddressDTO from "@modules/doctors/dtos/CreateAddressDTO";
import FindAddressDTO from "@modules/doctors/dtos/FindAddressDTO";
import Address from "@modules/doctors/infra/typeorm/entities/Address";
import IAddressesRepository from "@modules/doctors/repositories/IAddressesRepository";
import { getRepository, Repository } from "typeorm";

export default class AddressesRepository implements IAddressesRepository {
  private ormRepository: Repository<Address>

  constructor() {
    this.ormRepository = getRepository(Address)
  }

  public async findOne(data: FindAddressDTO): Promise<Address | undefined> {
    const address = await this.ormRepository.find({ where: data })

    return address[0]
  }

  public async create(data: CreateAddressDTO): Promise<Address> {
    const address = this.ormRepository.create(data)

    await this.ormRepository.save(address)

    return address
  }

}
