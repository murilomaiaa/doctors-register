import AppError from '@shared/errors/AppError';
import Address from '../infra/typeorm/entities/Address';
import Specialty from '../infra/typeorm/entities/Specialty';
import FakeDoctorsRepository from '../repositories/fakes/FakeDoctorsRepository';
import FakeSpecialtiesRepository from '../repositories/fakes/FakeSpecialtiesRepository';
import CreateDoctorService from './CreateDoctorService';

let fakeDoctorsRepository: FakeDoctorsRepository;
let fakeSpecialtiesRepository: FakeSpecialtiesRepository;
let createDoctor: CreateDoctorService;

const data = {
  name: 'Doctor',
  crm: '0000000',
  landline: '3133333333',
  phone: '31988888888',
  address: new Address(),
  specialties: ["CARDIOLOGIA CLÍNICA", "CIRURGIA CARDÍACA"]
}

describe('CreateDoctor', () => {
  beforeEach(() => {
    fakeDoctorsRepository = new FakeDoctorsRepository();
    fakeSpecialtiesRepository = new FakeSpecialtiesRepository();
    createDoctor = new CreateDoctorService(fakeDoctorsRepository, fakeSpecialtiesRepository);
  });

  it('should be able to create a new doctor', async () => {
    const doctor = await createDoctor.execute(data);

    expect(doctor).toHaveProperty('id');
  });

  it('should not be able to create a doctor with an already used crm', async () => {
    await fakeDoctorsRepository.create({ ...data, specialties: [new Specialty(), new Specialty()] })

    await expect(
      createDoctor.execute({
        crm: data.crm,
        name: 'Other Doctor',
        address: new Address(),
        landline: 'other landline',
        phone: 'other phone',
        specialties: ["ANGIOLOGIA", "ALERGOLOGIA"],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a doctor with less than 2 specialties', async () => {
    await expect(
      createDoctor.execute({
        ...data,
        specialties: ["ANGIOLOGIA"],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a doctor with an uncreated specialty', async () => {
    await expect(
      createDoctor.execute({
        ...data,
        specialties: ["ANGIOLOGIA", "non created"],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
