import FakeDoctorsRepository from '@modules/doctors/repositories/fakes/FakeDoctorsRepository';
import AppError from '@shared/errors/AppError';
import Address from '../infra/typeorm/entities/Address';
import Specialty from '../infra/typeorm/entities/Specialty';
import DeleteDoctorService from './DeleteDoctorService';

let fakeDoctorsRepository: FakeDoctorsRepository;
let deletePerson: DeleteDoctorService;

const data = {
  name: 'Doctor',
  crm: '0000000',
  landline: '3133333333',
  phone: '31988888888',
  address: new Address(),
  specialties: ["CARDIOLOGIA CLÍNICA", "CIRURGIA CARDÍACA"]
}

describe('DeleteDoctor', () => {
  beforeEach(() => {
    fakeDoctorsRepository = new FakeDoctorsRepository();
    deletePerson = new DeleteDoctorService(fakeDoctorsRepository);
  });

  it('should be able to delete a doctor', async () => {
    const doctor = await fakeDoctorsRepository.create({
      ...data,
      specialties: [new Specialty(), new Specialty()]
    })

    await deletePerson.execute(doctor.id);

    const doctorWithId1 = await fakeDoctorsRepository.findOne('1')

    expect(doctor.id).toEqual('1');
    expect(doctorWithId1).toBeUndefined()
  });

  it('should not be able to delete a non existent doctor', async () => {
    await expect(
      deletePerson.execute('1'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
