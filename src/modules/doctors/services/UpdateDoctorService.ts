import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import UpdateDoctorDTO from '../dtos/UpdateDoctorDTO';
import Doctor from '../infra/typeorm/entities/Doctor';
import IDoctorsRepository from '../repositories/IDoctorsRepository';
import ISpecialtiesRepository from '../repositories/ISpecialtiesRepository';

@injectable()
class UpdateDoctorService {
  constructor(
    @inject('DoctorsRepository')
    private doctorsRepository: IDoctorsRepository,

    @inject('SpecialtiesRepository')
    private specialtiesRepository: ISpecialtiesRepository,
  ) { }

  public async execute(data: UpdateDoctorDTO): Promise<Doctor> {
    const specialtiesWithoutDuplications =
      data.specialties.filter((specialty, position, arr) =>
        arr.indexOf(specialty) === position
      )
    if (specialtiesWithoutDuplications.length < 2) {
      throw new AppError("An doctor must have at least 2 specialties")
    }

    const doctor = await this.doctorsRepository.findOne(data.id);
    if (!doctor)
      throw new AppError('Doctor not found');

    const doctorWithGivenCrm = await this.doctorsRepository.findByCrm(data.crm)
    if (doctorWithGivenCrm && doctor.id !== doctorWithGivenCrm.id)
      throw new AppError('CRM already in use')


    const specialties = await this.specialtiesRepository.findSpecialties(
      specialtiesWithoutDuplications.map(s => s.name)
    )

    if (specialtiesWithoutDuplications.length !== specialties.length) {
      const uncreatedSpecialties = specialtiesWithoutDuplications.filter(
        specialty => !specialties.find(s => s.name === specialty.name)
      )

      throw new AppError(`Unknown specialties ${uncreatedSpecialties.join(', ')}`)
    }

    Object.assign(doctor, { ...data });

    await this.doctorsRepository.save(doctor);
    return doctor
  }
}

export default UpdateDoctorService;
