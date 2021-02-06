import 'reflect-metadata';
import Address from '../infra/typeorm/entities/Address';
import FakeAddressesRepository from '../repositories/fakes/FakeAddressesRepository';
import FakeDoctorsRepository from '../repositories/fakes/FakeDoctorsRepository';
import FilterDoctorsService from './FilterDoctorsService';

let fakeDoctorsRepository: FakeDoctorsRepository;
let filterDoctors: FilterDoctorsService;

const address = {
  id: '1',
  zipcode: '35164000',
  state: 'MG',
  city: 'Ipatinga',
  neighborhood: 'Centro',
  street: 'Avenida Principal',
  number: '0',
  createdAt: new Date(),
  updatedAt: new Date(),
} as Address

const specialties = [
  { id: '1', name: "ALERGOLOGIA", createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: "ANGIOLOGIA", createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: "BUCO MAXILO", createdAt: new Date(), updatedAt: new Date() },
  { id: '4', name: "CARDIOLOGIA CLÍNICA", createdAt: new Date(), updatedAt: new Date() },
  { id: '5', name: "CARDIOLOGIA INFANTIL", createdAt: new Date(), updatedAt: new Date() },
  { id: '6', name: "CIRURGIA CABEÇA E PESCOÇO", createdAt: new Date(), updatedAt: new Date() },
  { id: '7', name: "CIRURGIA CARDÍACA", createdAt: new Date(), updatedAt: new Date() },
  { id: '8', name: "CIRURGIA DE TÓRAX", createdAt: new Date(), updatedAt: new Date() },
]

const data = {
  name: 'Doctor',
  crm: '0000000',
  landline: '3133333333',
  phone: '31988888888',
  address,
  specialties: [specialties[0], specialties[1]]
}

describe('FindFilteredDoctors', () => {
  beforeEach(() => {
    fakeDoctorsRepository = new FakeDoctorsRepository();
    filterDoctors = new FilterDoctorsService(fakeDoctorsRepository);
  });

  it('should be able to find a doctor with a given id', async () => {
    const doctor = await fakeDoctorsRepository.create(data);
    await fakeDoctorsRepository.create({
      ...data,
      crm: '1234567',
      name: 'Who'
    });

    const doctors = await filterDoctors.execute({
      id: doctor.id
    });

    expect(doctors).toHaveLength(1);
    expect(doctors[0].name).toBe(data.name);
    expect(doctors[0].crm).toBe(data.crm);
  });

  it("should be able to return an empty array when don't any doctor", async () => {
    await fakeDoctorsRepository.create(data);
    const doctors = await filterDoctors.execute({ id: 'some-id' });

    expect(doctors).toHaveLength(0);
  });

  it('should be able to find doctors with one param', async () => {
    await fakeDoctorsRepository.create(data);
    await fakeDoctorsRepository.create({ ...data, crm: '1234567' });
    await fakeDoctorsRepository.create({ ...data, crm: '1231234', phone: '400028922' });

    const doctors = await filterDoctors.execute({
      phone: data.phone
    });

    expect(doctors).toHaveLength(2);
  });

  it('should be able to find doctors with two or more params', async () => {
    await fakeDoctorsRepository.create(data);
    await fakeDoctorsRepository.create({
      ...data,
      crm: '1234567',
      specialties: [...data.specialties, specialties[5]]
    });
    const thirdDoctor = await fakeDoctorsRepository.create({
      ...data,
      crm: '1231234',
      specialties: [specialties[4], specialties[5]],
      address: { ...data.address, number: 's/n', id: '2' }
    });

    const find1 = await filterDoctors.execute({
      specialties: [specialties[5].name],
      name: data.name
    });

    const find2 = await filterDoctors.execute({
      specialties: [specialties[4].name],
      name: data.name,
      phone: data.phone
    });

    expect(find1).toHaveLength(2);
    expect(find2).toHaveLength(1);
    expect(find2[0].id).toEqual(thirdDoctor.id)
  });

  it('should be able to find doctor by address', async () => {
    await fakeDoctorsRepository.create(data);
    await fakeDoctorsRepository.create({
      ...data,
      address: { ...data.address, zipcode: '12345678', id: '2' }
    });
    await fakeDoctorsRepository.create({
      ...data,
      address: {
        ...data.address,
        number: '2',
        id: '3'
      }
    });
    await fakeDoctorsRepository.create({
      ...data,
      address: {
        ...data.address,
        number: '3',
        id: '4'
      }
    });
    await fakeDoctorsRepository.create({
      ...data,
      address: {
        ...data.address,
        number: '3',
        complementary: 'Fundos',
        id: '5'
      }
    });

    expect(
      await filterDoctors.execute({ address: { zipcode: data.address.zipcode } })
    ).toHaveLength(4)

  })

  it('should find all doctors with zero params', async () => {
    await fakeDoctorsRepository.create(data);
    await fakeDoctorsRepository.create({ ...data, crm: '1234567' });
    await fakeDoctorsRepository.create({ ...data, crm: '1231234', phone: '400028922' });

    expect(await filterDoctors.execute()).toHaveLength(3);
  });
});
