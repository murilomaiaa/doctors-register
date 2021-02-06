import { createContext, useState, useContext } from 'react'

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

type DoctorsState = Array<Doctor>

interface DoctorsContextData {
  doctors: DoctorsState
  setDoctors: (doctors: DoctorsState) => void
}

const DoctorsContext = createContext<DoctorsContextData>({} as DoctorsContextData)

const DoctorsProvider = ({ children }) => {
  const [doctors, setDoctors] = useState<DoctorsState>([])

  return (
    <DoctorsContext.Provider
      value={{
        doctors: doctors,
        setDoctors: setDoctors,
      }}
    >
      { children}
    </DoctorsContext.Provider>
  )
}

const useDoctors = () => {
  const context = useContext(DoctorsContext)

  if (!context) throw new Error("useDoctors must be wrapped by a GuestsContext.Provider")

  return context
}

export { DoctorsProvider, useDoctors }
