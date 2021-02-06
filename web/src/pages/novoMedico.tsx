import { Button, Checkbox, Container, Flex, FormLabel, Heading, Text } from "@chakra-ui/react";
import { FormHandles, Scope } from '@unform/core'
import { Form } from '@unform/web'
import { GetServerSideProps } from "next";
import { ChangeEvent, FocusEvent, useCallback, useEffect, useRef, useState } from "react";
import { Header, Input, InputMask, Select } from "../components";
import api from "../services/api";
import cep from 'cep-promise'

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

type FormData = Record<string, unknown>
//  {
//   name: string
//   crm: string
//   landline: string
//   phone: string
//   specialties

// }

type Props = {
  specialties: Array<{
    id: string
    name: string
  }>
}

const NovoMedico = ({ specialties }: Props) => {
  const formRef = useRef<FormHandles>(null)
  const [doctorSpecialties, setDoctorSpecialties] = useState<string[]>([undefined, undefined])

  const [cepFound, setCepFound] = useState(false)
  const [address, setAddress] = useState({} as Address)
  const [hasNumber, setHasNumber] = useState(true)

  const handleAddSelect = useCallback(() => {
    setDoctorSpecialties(ds => [...ds, undefined])
  }, [setDoctorSpecialties])

  const handleDeleteSelect = useCallback((index: number) => {
    setDoctorSpecialties(doctorSpecialties.filter((_, i) => i !== index))
  }, [setDoctorSpecialties, doctorSpecialties])

  const handleSubmit = useCallback(async (data: FormData) => {
    try {
      await api.post('/doctors', data)
    } catch {

    }
  }, [])
  const findAddress = useCallback(async (e: FocusEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>) => {
    try {
      const zipcode = e.target.value.replace('-', '')
      if (zipcode.length !== 8) {
        return
      }
      if (cepFound) return
      const address = cep(zipcode)
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
    <Container maxW="600px" mx='auto' my={10}>
      <Form onSubmit={handleSubmit} ref={formRef}>
        <Heading size="lg">Cadastrar novo médico</Heading>
        <Input name="name" label="Nome completo" />
        <InputMask
          name="crm"
          mask="99.999.99"
          label="CRM"
        />
        <InputMask
          mask="(99) 9999-9999"
          label="Telefone fixo"
          name="phone"
        />
        <InputMask
          mask="(99) 99999-9999"
          label="Celular"
          name="phone"
        />
        <FormLabel>Especialidades médicas</FormLabel>
        <Scope path="specialties">
          {doctorSpecialties.map((specialty, index) => (<>
            <Flex key={`flex-${index}`}>
              <Select
                name={`${index}`}
                label={`Especialidade ${index + 1}`}
                flex="1"
              >
                {specialties.map(s => (
                  <option value={s}>{s}</option>
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
          </>))}
          <Flex w="100%" flexDir="row-reverse" mt={4}>
            <Button
              colorScheme="green"
              ml={4}
              onClick={handleAddSelect}
            >+</Button>
          </Flex>
        </Scope>
        <Scope path="address">
          <Heading mb={3} size="md">
            Endereço
          </Heading>

          <InputMask
            mask="99999-999"
            label="CEP"
            name="zipcode"
            placeholder="Informe o cep"
            onBlur={findAddress}
            formControlProps={{ pr: 2, maxW: "50%" }}
            onChange={e => {
              setCepFound(false)
              if (e.target.value.length < 9) formRef.current.setFieldError('address.zipcode', null)
              if (e.target.value.length === 9) findAddress(e)
            }}
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
              label="Complemento"
              name="complementary"
              mb={4}
              defaultValue={address.complementary}
              label="Complemento (opcional)"
            />

          </>
          }
        </Scope>
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
