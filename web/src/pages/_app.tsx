import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import { DoctorsProvider } from '../hooks/doctors'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <DoctorsProvider>
        <Component {...pageProps} />
      </DoctorsProvider>
    </ChakraProvider>
  )
}

export default MyApp
