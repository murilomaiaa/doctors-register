import FindAddressDTO from "@modules/doctors/dtos/FindAddressDTO";
import Address from "@modules/doctors/infra/typeorm/entities/Address";
import IAddressesRepository from "../IAddressesRepository";

export default class FakeAddressesRepository implements IAddressesRepository {
  private addresses: Address[] = []

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
}
