import { Button, Container, Flex, Table, Tbody, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { useCallback, useEffect, useState } from 'react'
import { Header } from '../components'
import api from '../services/api'
import formatCRM from '../utils/formatCRM'
import formatPhoneNumber from '../utils/formatPhoneNumber'

import dynamic from 'next/dynamic'
import { useDoctors } from '../hooks/doctors'
import { useRouter } from 'next/dist/client/router'
const Modal = dynamic(
  () => import('../components/Modal'),
  {
    ssr: false
  }
)

const Drawer = dynamic(
  () => import('../components/Drawer'),
  {
    ssr: false
  }
)

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

type Props = {
  doctors: Doctor[]
}

const Home = ({ doctors: doctorsProps }: Props) => {
  const { doctors, setDoctors } = useDoctors()
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure()
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>({} as Doctor)
  const [isModalOpen, setModalIsOpen] = useState(false)
  const onModalClose = useCallback(() => setModalIsOpen(false), [setModalIsOpen])
  const [modalIsRendered, setModalIsRendered] = useState(false)
  const [drawerIsRendered, setDrawerIsRendered] = useState(false)

  const router = useRouter()

  useEffect(() => {
    setDoctors([...doctorsProps])
  }, [doctors])

  const handleOpenModal = useCallback((doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setModalIsRendered(true)
    setModalIsOpen(true)
  }, [setSelectedDoctor, setModalIsRendered,])

  const handleAddNewUser = useCallback(() => {
    router.push('/novoMedico')
  }, [router])

  return (
    <>
      <Header />
      <Container maxW="1200px" mx='auto' mt={10}>
        <Flex flexDir="row-reverse" mx={6}>
          <Button
            variant="solid"
            colorScheme="green"
            onClick={handleAddNewUser}
          >
            Novo +
          </Button>
        </Flex>
        <Table colorScheme="blue" size="md" bg="gray.50">
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>CRM</Th>
              <Th>Telefone</Th>
              <Th>Especialidades</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {doctors.map(doctor => (
              <Tr key={`row-${doctor.id}`} _hover={{ bg: 'blue.50' }}>
                <Th>{doctor.name}</Th>
                <Th>{formatCRM(doctor.crm)}</Th>
                <Th>{formatPhoneNumber(doctor.landline)}</Th>
                <Th>{doctor.specialties.join(', ')}</Th>
                <Th>
                  <Button
                    variant="solid"
                    colorScheme="blue"
                    onClick={() => handleOpenModal(doctor)}
                  >
                    Ver Mais
                </Button>
                </Th>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Container>
      {modalIsRendered && (
        <Modal doctor={selectedDoctor} isOpen={isModalOpen} onClose={onModalClose} />
      )}

      {drawerIsRendered && (
        <Drawer />
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { data } = await api.get('/doctors')

  const doctors: Doctor[] = data.map(doctor => ({
    ...doctor,
    specialties: doctor.specialties.map(s => s.name)
  }))

  return {
    props: { doctors }
  }
}

export default Home
