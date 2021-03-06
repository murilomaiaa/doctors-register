import RepositoryFilterDoctorsDTO from "@modules/doctors/dtos/RepositoryFilterDoctorsDTO";
import RepositoryCreateDoctorDTO from "@modules/doctors/dtos/RepositoryCreateDoctorDTO";
import Doctor from "@modules/doctors/infra/typeorm/entities/Doctor";
import Specialty from "@modules/doctors/infra/typeorm/entities/Specialty";
import Address from "@modules/doctors/infra/typeorm/entities/Address";
import IDoctorsRepository from "@modules/doctors/repositories/IDoctorsRepository";
import { getRepository, Repository } from "typeorm";

export default class DoctorsRepository implements IDoctorsRepository {
  private ormRepository: Repository<Doctor>

  constructor() {
    this.ormRepository = getRepository(Doctor)
  }

  public async create(data: RepositoryCreateDoctorDTO): Promise<Doctor> {
    const doctor = this.ormRepository.create(data);

    await this.ormRepository.save(doctor);

    return doctor;
  }

  public async save(doctor: Doctor): Promise<void> {
    await this.ormRepository.save(doctor)
  }

  public async findOne(id: string): Promise<Doctor | undefined> {
    return this.ormRepository.findOne(id)
  }
  public async findByCrm(crm: string): Promise<Doctor | undefined> {
    return this.ormRepository
      .createQueryBuilder('doctor')
      .where('doctor.crm = :crm', { crm })
      .withDeleted()
      .getOne()
  }

  public async findAll(): Promise<Doctor[]> {
    return this.ormRepository.find()
  }

  public async filter({
    address,
    specialties,
    ...rest
  }: RepositoryFilterDoctorsDTO): Promise<Doctor[]> {
    console.log(specialties)
    const filter: Record<string, unknown> = {}
    Object.entries(rest).forEach(([key, value]) => {
      if (value) {
        filter[key] = value
      }
    })

    if (!address && !specialties) {
      return this.ormRepository.find(filter)
    }

    if (!specialties && address) {
      let addressFilter = ''

      Object.entries(address).forEach(([key, value]) => {
        if (value) {
          addressFilter += `a.${key} = '${value}'`
        }
      })

      return this.ormRepository
        .createQueryBuilder('d')
        .select()
        .innerJoinAndSelect('d.specialties', 's')
        .innerJoinAndSelect('d.address', 'a')
        .where(filter)
        .andWhere(addressFilter)
        .getMany()
    }

    const doctors = await this.ormRepository
      .createQueryBuilder('d')
      .select()
      .innerJoinAndSelect('d.specialties', 's')
      .innerJoinAndSelect('d.address', 'a')
      .where(filter)
      .getMany()

    const specialtiesFilter = (doctorSpecialties: Specialty[]) => {
      if (!specialties) return true;
      const specialtiesNames = doctorSpecialties.map(s => s.name);
      for (let i = 0; i < specialties.length; i++) {
        if (specialtiesNames.indexOf(specialties[i]) === -1) {
          return false
        }
      }
      return true;
    }

    return doctors.filter(doctor => specialtiesFilter(doctor.specialties))
  }

  public async delete(doctor: Doctor): Promise<void> {
    await this.ormRepository.softDelete(doctor.id)
  }
}
