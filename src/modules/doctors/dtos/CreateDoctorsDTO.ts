import Address from "../infra/typeorm/entities/Address"

type CreateDoctorsDTO = {
  name: string
  crm: string
  landline: string
  phone: string
  address: Address
  specialties: string[]
}

export default CreateDoctorsDTO
