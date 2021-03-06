import RepositoryFilterDoctorsDTO from "../dtos/RepositoryFilterDoctorsDTO";
import RepositoryCreateDoctorDTO from "../dtos/RepositoryCreateDoctorDTO";
import Doctor from "../infra/typeorm/entities/Doctor";

export default interface IDoctorsRepository {
  create: (data: RepositoryCreateDoctorDTO) => Promise<Doctor>;
  findOne: (id: string) => Promise<Doctor | undefined>;
  findByCrm: (crm: string) => Promise<Doctor | undefined>;
  findAll: () => Promise<Doctor[]>;
  filter: (data: RepositoryFilterDoctorsDTO) => Promise<Doctor[]>;
  save: (doctor: Doctor) => Promise<void>;
  delete: (doctor: Doctor) => Promise<void>;
}
