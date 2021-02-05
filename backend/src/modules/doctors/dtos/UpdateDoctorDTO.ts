import Address from "../infra/typeorm/entities/Address"

type UpdateDoctorDTO = {
  id: string
  name: string
  crm: string
  landline: string
  phone: string
  address: Address
  specialties: string[]
}

export default UpdateDoctorDTO
