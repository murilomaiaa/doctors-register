import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import CreateDoctorsDTO from '../dtos/CreateDoctorsDTO';
import Doctor from '../infra/typeorm/entities/Doctor';
import IDoctorsRepository from '../repositories/IDoctorsRepository';
import ISpecialtiesRepository from '../repositories/ISpecialtiesRepository';

@injectable()
class CreateDoctorService {
  constructor(
    @inject('DoctorsRepository')
    private doctorsRepository: IDoctorsRepository,

    @inject('SpecialtiesRepository')
    private specialtiesRepository: ISpecialtiesRepository,

  ) { }

  public async execute(data: CreateDoctorsDTO): Promise<Doctor> {
    const specialtiesWithoutDuplications =
      data.specialties.filter((specialty, position, arr) =>
        arr.indexOf(specialty) === position
      )
    if (specialtiesWithoutDuplications.length < 2 || specialtiesWithoutDuplications.includes("")) {
      throw new AppError("An doctor must have at least 2 non empty specialties")
    }

    const crmAlreadyInUse = !!(await this.doctorsRepository.findByCrm(data.crm))

    if (crmAlreadyInUse) throw new AppError("CRM already in use")

    const specialties = await this.specialtiesRepository.findSpecialties(specialtiesWithoutDuplications)

    if (specialtiesWithoutDuplications.length !== specialties.length) {
      const uncreatedSpecialties = specialtiesWithoutDuplications.filter(
        specialty => !specialties.find(s => s.name === specialty)
      )

      throw new AppError(`Unknown specialties ${uncreatedSpecialties.join(', ')}`)
    }
    const doctor = await this.doctorsRepository.create({
      ...data,
      specialties,
    })

    return doctor
  }
}

export default CreateDoctorService;
