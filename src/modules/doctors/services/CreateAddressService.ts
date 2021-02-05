import { injectable, inject } from 'tsyringe';
import CreateAddressDTO from '../dtos/CreateAddressDTO';
import Address from '../infra/typeorm/entities/Address';
import IAddressesRepository from '../repositories/IAddressesRepository';

@injectable()
export default class CreateAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {
    //
  }

  public async execute(data: CreateAddressDTO): Promise<Address> {
    const address = await this.addressesRepository.findOne(data);

    return address || this.addressesRepository.create(data);
  }
}
