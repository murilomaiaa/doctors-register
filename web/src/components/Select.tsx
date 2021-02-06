import { useEffect, useRef } from 'react'
import { useField } from '@unform/core'
import {
  FormControl,
  FormLabel,
  InputGroup,
  SelectProps,
  Select as CSelect
} from '@chakra-ui/react'

interface Props extends SelectProps {
  name: string
  label: string
}

const Select: React.FC<Props> = ({ name, label, children, ...rest }) => {
  const ref = useRef<HTMLSelectElement>(null)
  const { fieldName, defaultValue, error, registerField } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'value'
    })
  }, [fieldName, registerField])

  return (
    <InputGroup>
      <FormControl isInvalid={!!error}>
        <FormLabel htmlFor={fieldName}>{label}</FormLabel>

        <CSelect defaultValue={defaultValue} id={fieldName} ref={ref} _disabled={{ bg: 'gray.100' }}{...rest}>
          {children}
        </CSelect>
      </FormControl>
    </InputGroup>
  )
}

export default Select
