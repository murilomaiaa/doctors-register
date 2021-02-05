import FakeAddressesRepository from '@modules/doctors/repositories/fakes/FakeAddressesRepository';
import CreateAddressService from './CreateAddressService';

let fakeAddressesRepository: FakeAddressesRepository;
let createAddress: CreateAddressService;

describe('CreateAddress', () => {
  beforeEach(() => {
    fakeAddressesRepository = new FakeAddressesRepository();
    createAddress = new CreateAddressService(fakeAddressesRepository);
  });

  it('should be able to create a new address', async () => {
    const address = await createAddress.execute({
      zipcode: '35171000',
      state: 'mg',
      city: 'Coronel Fabriciano',
      neighborhood: 'Centro',
      street: 'Avenida',
      number: '0',
    });

    expect(address).toHaveProperty('id');
  });

  it('should be able to return an existent address', async () => {
    const address = {
      zipcode: '35171000',
      state: 'mg',
      city: 'Coronel Fabriciano',
      neighborhood: 'Centro',
      street: 'Avenida',
      number: '0',
    };

    const address1 = await createAddress.execute(address);
    const address2 = await createAddress.execute(address);
    const address3 = await createAddress.execute({
      ...address,
      complementary: 'Fundos',
    });

    const address4 = await createAddress.execute({
      ...address,
      complementary: 'other-complementary',
    });

    expect(address1.id).toEqual('1');
    expect(address2.id).toEqual('1');
    expect(address3.id).toEqual('2');
    expect(address4.id).toEqual('3');
  });
});
