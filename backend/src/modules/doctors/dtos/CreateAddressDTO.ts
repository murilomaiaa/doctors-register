type CreateAddressDTO = {
  zipcode: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complementary?: string;
}

export default CreateAddressDTO;
