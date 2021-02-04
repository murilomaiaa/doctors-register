import FilterDoctorsDTO from "@modules/doctors/dtos/FilterDoctorsDTO";
import RepositoryCreateDoctorDTO from "@modules/doctors/dtos/RepositoryCreateDoctorDTO";
import Doctor from "@modules/doctors/infra/typeorm/entities/Doctor";
import IDoctorsRepository from "../IDoctorsRepository";

export default class FakeDoctorsRepository implements IDoctorsRepository {
  private doctors: Doctor[] = []

  private nextId = 1;

  public async create(data: RepositoryCreateDoctorDTO): Promise<Doctor> {
    const doctor = new Doctor()

    Object.assign(doctor, {
      id: this.nextId,
      ...data
    })

    this.doctors.push(doctor)

    return doctor
  }

  public async save(doctor: Doctor): Promise<void> {
    const index = this.doctors.findIndex(r => r.id === doctor.id);

    this.doctors[index] = doctor;
  }

  public async findOne(id: string): Promise<Doctor | undefined> {
    return this.doctors.find(doctor => doctor.id === id && !doctor.deletedAt)
  }
  public async findByCrm(crm: string): Promise<Doctor | undefined> {
    return this.doctors.find(doctor => doctor.crm === doctor.crm)
  }

  public async filter(data: FilterDoctorsDTO): Promise<Doctor[]> {
    return []
  }

  public async delete(doctor: Doctor): Promise<void> {
    const index = this.doctors.findIndex(r => r.id === doctor.id);

    this.doctors[index].deletedAt = new Date()
  }

}
