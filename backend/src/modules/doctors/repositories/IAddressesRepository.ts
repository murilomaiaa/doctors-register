import CreateAddressDTO from "../dtos/CreateAddressDTO";
import FindAddressDTO from "../dtos/FindAddressDTO";
import Address from "../infra/typeorm/entities/Address";

export default interface IAddressesRepository {
  findOne: (data: FindAddressDTO) => Promise<Address | undefined>
  create: (data: CreateAddressDTO) => Promise<Address>
}
