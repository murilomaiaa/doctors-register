import { Flex, FlexProps, Text } from '@chakra-ui/react'

export default function Header(props: FlexProps) {
  return (
    <Flex
      as="nav"
      background="gray.50"
      paddingY="4"
      marginX="auto"
      boxShadow="0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);"
      marginBottom="4"
      overflow="hidden"
      placeContent="center"
      // w="100vw"
      {...props}
    >
      <Flex>
        <Text fontWeight="bold">Gerenciamento de médicos</Text>
      </Flex>
    </Flex >
  )
}
