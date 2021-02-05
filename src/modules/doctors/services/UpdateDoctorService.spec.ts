import FakeDoctorsRepository from '@modules/doctors/repositories/fakes/FakeDoctorsRepository';
import AppError from '@shared/errors/AppError';
import Address from '../infra/typeorm/entities/Address';
import Specialty from '../infra/typeorm/entities/Specialty';
import FakeSpecialtiesRepository from '../repositories/fakes/FakeSpecialtiesRepository';
import UpdateDoctorService from './UpdateDoctorService';

let fakeDoctorsRepository: FakeDoctorsRepository;
let fakeSpecialtiesRepository: FakeSpecialtiesRepository;
let updatePerson: UpdateDoctorService;

const data = {
  name: 'Doctor',
  crm: '0000000',
  landline: '3133333333',
  phone: '31988888888',
  address: new Address(),
  specialties: ["CARDIOLOGIA CLÍNICA", "CIRURGIA CARDÍACA"]
}

describe('UpdateDoctor', () => {
  beforeEach(() => {
    fakeDoctorsRepository = new FakeDoctorsRepository();
    fakeSpecialtiesRepository = new FakeSpecialtiesRepository();
    updatePerson = new UpdateDoctorService(
      fakeDoctorsRepository, fakeSpecialtiesRepository
    );
  });

  it('should be able to update a doctor', async () => {
    let doctor = await fakeDoctorsRepository.create({
      ...data,
      specialties: [new Specialty(), new Specialty()]
    })

    const specialties = ["BUCO MAXILO", "CARDIOLOGIA CLÍNICA"]

    doctor = await updatePerson.execute({
      ...doctor,
      landline: '3133333334',
      crm: '1111111',
      specialties
    });

    expect(doctor.id).toEqual('1');
    expect(doctor.name).toEqual(data.name);
    expect(doctor.landline).toEqual('3133333334');
    expect(doctor.crm).toEqual('1111111');
    expect(doctor.specialties).toContain(specialties[0])
    expect(doctor.specialties).toContain(specialties[1])
  });

  it('should not be able to update a non existent doctor', async () => {
    await expect(
      updatePerson.execute({
        id: '1',
        ...data,
        specialties: ["CARDIOLOGIA CLÍNICA", "CIRURGIA CARDÍACA"]
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the CRM to an already used one', async () => {
    await fakeDoctorsRepository.create({
      ...data,
      specialties: [new Specialty(), new Specialty()]
    })

    const doctor = await fakeDoctorsRepository.create({
      ...data,
      specialties: [new Specialty(), new Specialty()],
      crm: '1111111',
    })

    await expect(
      updatePerson.execute({
        ...doctor,
        crm: data.crm,
        specialties: doctor.specialties.map(s => s.name)
      }),
    ).rejects.toBeInstanceOf(AppError);
  })

  it("should not be able to update a doctor by placing less than 2 specialties", async () => {
    const doctor = await fakeDoctorsRepository.create({
      ...data,
      specialties: [new Specialty(), new Specialty()]
    })

    await expect(
      updatePerson.execute({
        ...doctor,
        specialties: [""]
      }),
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should not be able to update a doctor by placing an non existent specialty', async () => {
    let doctor = await fakeDoctorsRepository.create({
      ...data,
      specialties: [new Specialty(), new Specialty()]
    })

    await expect(
      updatePerson.execute({
        ...doctor,
        specialties: ["CARDIOLOGIA CLÍNICA", "non created"]
      })
    ).rejects.toBeInstanceOf(AppError)
  })
});
