import CreateAddressDTO from "@modules/doctors/dtos/CreateAddressDTO";
import FindAddressDTO from "@modules/doctors/dtos/FindAddressDTO";
import Address from "@modules/doctors/infra/typeorm/entities/Address";
import IAddressesRepository from "../IAddressesRepository";

export default class FakeAddressesRepository implements IAddressesRepository {
  private addresses: Address[] = []

  private nextId = 1

  public async findOne(data: FindAddressDTO): Promise<Address | undefined> {
    if (typeof data === 'string') {
      return this.addresses.find(address => address.id === data);
    } else {
      const { complementary, number, zipcode } = data;
      return this.addresses.find(
        a => a.zipcode === zipcode && a.number === number && a.complementary === complementary
      );
    }
  }

  public async create(data: CreateAddressDTO): Promise<Address> {
    const address = new Address();

    Object.assign(address, {
      id: String(this.nextId),
      ...data,
    });

    this.nextId++;

    this.addresses.push(address);

    return address;
  }

}
