import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogProps, Box, Button, CloseButton, Flex, Heading, Table, Tbody, Text, Th, Tr, useToast } from "@chakra-ui/react"
import { useCallback, useRef } from "react"
import { useDoctors } from "../hooks/doctors"
import api from "../services/api"
import formatCRM from "../utils/formatCRM"
import formatPhoneNumber from "../utils/formatPhoneNumber"

type Address = {
  zipcode: string
  state: string
  city: string
  neighborhood: string
  street: string
  number: string
  complementary?: string
}

type Doctor = {
  id: string
  name: string
  crm: string
  phone: string
  landline: string
  specialties: string[]
  address: Address
}

type Props = Omit<AlertDialogProps, 'leastDestructiveRef' | 'children'> & {
  doctor: Doctor
}

export default ({ isOpen, onClose, doctor, ...rest }: Props) => {
  const cancelRef = useRef()
  const toast = useToast()
  const { setDoctors, doctors } = useDoctors()

  const fetchDeleteUser = useCallback(async () => {
    try {
      console.log('delete')
      await api.delete(`/doctors/${doctor.id}`)

      setDoctors(doctors.filter(d => d.id !== doctor.id))

      onClose()

      toast({
        isClosable: true,
        status: 'success',
        position: 'top-right',
        title: 'Médico excluído com sucesso',
      })
    } catch {
      toast({
        isClosable: true,
        status: 'error',
        position: 'top-right',
        title: 'Erro ao excluir médico',
        description: 'Ocorreu um erro ao excluir médico'
      })
    }
  }, [doctor])

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      {...rest}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold" display="flex" justifyContent="space-between">
            <Text>Dados do Doutor {doctor.name}</Text>
            <CloseButton onClick={onClose} />
          </AlertDialogHeader>
          <AlertDialogBody>
            <Flex justifyContent="center">
              <Box mb={8} w="100%">
                <Table>
                  <Tbody>
                    <Tr>
                      <Th>Nome</Th>
                      <Th>{doctor.name}</Th>
                    </Tr>
                    <Tr>
                      <Th>CRM</Th>
                      <Th>{formatCRM(doctor.crm)}</Th>
                    </Tr>
                    <Tr>
                      <Th>Telefone</Th>
                      <Th>{formatPhoneNumber(doctor.landline)}</Th>
                    </Tr>
                    <Tr>
                      <Th>Celular</Th>
                      <Th>{formatPhoneNumber(doctor.phone)}</Th>
                    </Tr>
                  </Tbody>
                </Table>
                <Heading size="sm" mt={4}>Endereço</Heading>
                <Table>
                  <Tbody>
                    <Tr>
                      <Th>CEP</Th>
                      <Th>{doctor.address.zipcode}</Th>
                    </Tr>
                    <Tr>
                      <Th>Estado</Th>
                      <Th>{doctor.address.state}</Th>
                    </Tr>
                    <Tr>
                      <Th>Cidade</Th>
                      <Th>{doctor.address.city}</Th>
                    </Tr>
                    <Tr>
                      <Th>Bairro</Th>
                      <Th>{doctor.address.neighborhood}</Th>
                    </Tr>
                    <Tr>
                      <Th>Endereço</Th>
                      <Th>{doctor.address.street}, n° {doctor.address.number} - {doctor.address.complementary}</Th>
                    </Tr>
                  </Tbody>
                </Table>
                <Heading size="sm" mt={4}>Especialidades</Heading>
                <Text>{doctor.specialties.join(', ')}</Text>
                <Flex flexDir="row-reverse">
                  <Button
                    variant="solid"
                    colorScheme="yellow"
                    ml={2}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="solid"
                    colorScheme="red"
                    onClick={fetchDeleteUser}
                  >
                    Excluir
                  </Button>
                </Flex>
              </Box>
            </Flex>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
