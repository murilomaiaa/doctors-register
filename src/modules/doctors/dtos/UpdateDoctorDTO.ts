import Address from "../infra/typeorm/entities/Address"
import Specialty from "../infra/typeorm/entities/Specialty"

type UpdateDoctorDTO = {
  id: string
  name: string
  crm: string
  landline: string
  phone: string
  address: Address
  specialties: Specialty[]
}

export default UpdateDoctorDTO
