import { Button, Checkbox, Container, Flex, FormLabel, Grid, GridItem, Heading, Text, toast, useToast } from "@chakra-ui/react";
import { FormHandles, Scope } from '@unform/core'
import { Form } from '@unform/web'
import { GetServerSideProps } from "next";
import { ChangeEvent, FocusEvent, useCallback, useEffect, useRef, useState } from "react";
import { Header, Input, InputMask, Select } from "../components";
import api from "../services/api";
import * as Yup from 'yup'
import { isSchema } from "yup";
import { useRouter } from "next/dist/client/router";
import getValidationErrors from "../utils/getValidationErrors";
type Address = {
  zipcode: string
  state: string
  city: string
  neighborhood: string
  street: string
  number: string
  complementary?: string
}

type AddressApi = Omit<Address, 'zipcode'> & {
  cep: string
}

type FormData = {
  name: string
  crm: string
  landline: string
  phone: string
  specialties: string[]
  address: Address
}

type Props = {
  specialties: string[]
}

const NovoMedico = ({ specialties }: Props) => {
  const formRef = useRef<FormHandles>(null)
  const specialtiesRef = useRef()
  const [doctorSpecialties, setDoctorSpecialties] = useState<string[]>([undefined, undefined])

  const router = useRouter()
  const toast = useToast()

  const [cepFound, setCepFound] = useState(false)
  const [address, setAddress] = useState({} as Address)
  const [hasNumber, setHasNumber] = useState(true)
  useEffect(() => {
    if (hasNumber) {
      formRef.current.setFieldValue('address.number', '')
    } else {
      formRef.current.setFieldValue('address.number', 'S/N')
    }
  }, [hasNumber])


  const handleAddSelect = useCallback(() => {
    setDoctorSpecialties(ds => [...ds, undefined])
  }, [setDoctorSpecialties])

  const handleDeleteSelect = useCallback((index: number) => {
    setDoctorSpecialties(doctorSpecialties.filter((_, i) => i !== index))
  }, [setDoctorSpecialties, doctorSpecialties])

  const handleSubmit = useCallback(async (data: FormData) => {
    try {
      formRef.current?.setErrors({});
      const addressSchema = Yup.object().shape({
        zipcode: Yup.string().required('Informe um CEP').length(8, 'Informe um CEP válido'),
        neighborhood: Yup.string().required('Informe um bairro'),
        street: Yup.string().required('Informe uma rua'),
        number: Yup.string().required('Informe um número')
      })

      // Yup.addMethod(Yup.object, 'unique', function (message) {
      //   return this.test('unique', message,);
      // });

      const schema = Yup.object().shape({
        name: Yup.string().required('Informe o seu nome').matches(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g, 'Insira apenas letras'),
        crm: Yup.string().required('Informe um CRM').length(7, 'Informe um CRM válido'),
        landline: Yup.string()
          .length(10, 'Digite m telefone válido')
          .required('Informe um telefone'),
        phone: Yup.string()
          .min(10, 'Digite um telefone válido')
          .max(11, 'Digite um telefone válido'),
        address: addressSchema,
        specialties: Yup.array().test('unique', 'Especialidades não podem ser repetidas', list => {
          return list.length === new Set(list.map(s => s)).size
        })
        // .unique('Especialidades não podem ser repetidas')
      })

      const apiRequestBody: FormData = {
        name: data.name,
        crm: data.crm.replaceAll('.', '').replaceAll('_', ''),
        landline: data.landline
          .replace('(', '')
          .replace(')', '')
          .replace(' ', '')
          .replace('-', '')
          .replaceAll('_', ''),
        phone: data.landline
          .replace('(', '')
          .replace(')', '')
          .replace(' ', '')
          .replace('-', '')
          .replaceAll('_', ''),
        specialties: data.specialties,
        address: {
          ...data.address,
          zipcode: data.address.zipcode.replace('-', ''),
          city: address.city,
          state: address.state
        }
      }
      await schema.validate(apiRequestBody, { abortEarly: false })
      await api.post('/doctors', apiRequestBody)
      toast({
        isClosable: true,
        position: 'top-right',
        status: 'success',
        title: 'Médico cadastrado com sucesso',
      })
      router.push('/')
    } catch (error) {
      console.log(data)
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);
        console.log({ errors })
        if (errors.specialties) {
          toast({
            isClosable: true,
            position: 'top-right',
            status: 'error',
            title: 'Ocorreu um erro ao cadastrar médico',
            description: 'Especialidades não podem ser repetidas'
          })
        }
      } else {
        console.log({ error })
        toast({
          isClosable: true,
          position: 'top-right',
          status: 'error',
          title: 'Ocorreu um erro ao cadastrar médico'
        })
      }
    }
  }, [address.city, address.state, toast, router, doctorSpecialties])
  const findAddress = useCallback(async (e: FocusEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>) => {
    try {
      setCepFound(false)
      console.log(e.target.value)
      const zipcode = e.target.value.replaceAll('_', '').replace('-', '')
      if (zipcode.length < 8) {
        formRef.current.setFieldError('address.zipcode', null)
        return
      }

      if (cepFound) return
      // const address = await cep(zipcode)
      const { data } = await api.get<AddressApi>(zipcode, { baseURL: 'https://brasilapi.com.br/api/cep/v1/' })
      const address = data
      if (!address.neighborhood) address.neighborhood = 'S/B'
      setAddress({ ...address, zipcode: address.cep, number: '' })
      const formData = formRef.current.getData()
      formRef.current.setData({ ...formData, address: { ...address, zipcode: e.target.value } })
      setCepFound(true)
    } catch (error) {
      console.log({ murilo: 'bonito', error })
      formRef.current.setFieldError('address.zipcode', 'CEP inválido')
    }
  }, [setCepFound, cepFound])

  return (<>
    <Header />
    <Container maxW="720px" mx='auto' my={10}>
      <Form onSubmit={handleSubmit} ref={formRef}>
        <Heading size="lg">Cadastrar novo médico</Heading>
        <Grid
          templateColumns={{ base: 'repeat(4,1fr)', md: 'repeat(8,1fr)' }}
          gap={4}
        >
          <GridItem colSpan={{ base: 4 }}>
            <Input name="name" label="Nome completo" />
          </GridItem>
          <GridItem colSpan={{ base: 4 }}>
            <InputMask
              name="crm"
              mask="99.999.99"
              label="CRM"
            />
          </GridItem>
          <GridItem colSpan={{ base: 4 }}>
            <InputMask
              mask="(99) 9999-9999"
              label="Telefone fixo"
              name="landline"
            />
          </GridItem>
          <GridItem colSpan={{ base: 4 }}>
            <InputMask
              mask="(99) 99999-9999"
              label="Celular"
              name="phone"
            />
          </GridItem>
        </Grid>
        <Scope path="specialties">
          <Heading size="md" my={4}>Especialidades médicas</Heading>
          <Grid
            templateColumns={{ base: 'repeat(4,1fr)', md: 'repeat(8,1fr)' }}
            gap={4}
          >
            {doctorSpecialties.map((specialty, index) => (
              <GridItem colSpan={4} key={`-${index}`}>
                <Flex >
                  <Select
                    name={`${index}`}
                    label={`Especialidade ${index + 1}`}
                    flex="1"
                  >
                    {specialties.map(s => (
                      <option key={`option-${s}`} value={s}>{s}</option>
                    ))}
                  </Select>
                  {index > 1 &&
                    <Button
                      colorScheme="red"
                      ml={4}
                      alignSelf="flex-end"
                      onClick={() => handleDeleteSelect(index)}
                    >-</Button>
                  }
                </Flex>
              </GridItem>
            ))}
            <GridItem colSpan={{ base: 4, md: 8 }}>
              <Button
                colorScheme="green"
                onClick={handleAddSelect}
              >Adicionar especialidade</Button>
            </GridItem>
          </Grid>
        </Scope>
        <Scope path="address">
          <Heading my={3} size="md">
            Endereço
          </Heading>

          <InputMask
            mask="99999-999"
            label="CEP"
            name="zipcode"
            placeholder="Informe o cep"
            formControlProps={{ pr: 2, maxW: "50%" }}
            onChange={findAddress}
          />
          {cepFound && (
            <Text ml={2} mb={2} fontSize="sm" alignSelf="flex-end">{address.city}/{address.state}</Text>
          )}

          {cepFound && <>
            <Input
              label="Bairro"
              name="neighborhood"
              placeholder="Informe o bairro"
              defaultValue={address.neighborhood}
            />

            <Input
              label="Endereço"
              name="street"
              placeholder="Informe a rua"
              defaultValue={address.street}
            />

            <Input
              label="Número"
              name="number"
              defaultValue={address.number}
              isDisabled={!hasNumber}
              mb={1}
            />
            <Checkbox
              mt={{ md: 4 }}
              ml={{ md: 2 }}
              onChange={() => {
                setHasNumber(!hasNumber)
              }}
              hidden={!cepFound}
            >
              Sem número
            </Checkbox>

            <Input
              name="complementary"
              mb={4}
              defaultValue={address.complementary}
              label="Complemento (opcional)"
            />

          </>
          }
        </Scope>
        <Button type="submit" variant="solid" colorScheme="green">Criar</Button>
      </Form>
    </Container>
  </>)
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { data } = await api.get('/specialties')

  return {
    props: { specialties: data.map(i => i.name) }
  }
}

export default NovoMedico;
