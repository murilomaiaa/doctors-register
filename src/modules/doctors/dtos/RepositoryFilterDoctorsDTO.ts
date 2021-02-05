type Address = {
  zipcode?: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  number?: string;
  complementary?: string;
}

type Specialty = string

type RepositoryFilterDoctorsDTO = {
  id?: string
  name?: string
  crm?: string
  landline?: string
  phone?: string
  address?: Address
  specialties?: Specialty[]
}

export default RepositoryFilterDoctorsDTO
