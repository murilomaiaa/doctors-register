import Specialty from "../infra/typeorm/entities/Specialty";
import CreateDoctorsDTO from "./CreateDoctorsDTO";

type RepositoryCreateDoctorDTO = Omit<CreateDoctorsDTO, 'specialties'> & {
  specialties: Specialty[]
}

export default RepositoryCreateDoctorDTO
