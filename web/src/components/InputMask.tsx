import { useRef, useEffect } from 'react'
import ReactInputMask, { Props as InputMaskProps } from 'react-input-mask'
import { useField } from '@unform/core'
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  FormControlProps,
  Input,
  InputProps as ChakraInputProps
} from '@chakra-ui/react'

type Props = InputMaskProps & {
  name: string
  label?: string
  formControlProps?: FormControlProps
  customLabel?: JSX.Element
  inputProps?: ChakraInputProps
}

const InputMask = ({ name, label, customLabel, formControlProps, placeholder, disabled, ...rest }: Props) => {
  if (!label && !customLabel) throw new Error("You need to use label or customLabel prop")

  const inputRef = useRef(null)
  const { fieldName, registerField, defaultValue, error } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      setValue(ref: any, value: string) {
        ref.setInputValue(value)
      },
      clearValue(ref: any) {
        ref.setInputValue('')
      }
    })
  }, [fieldName, registerField])

  return (
    <>
      <FormControl isInvalid={!!error} isDisabled={disabled} {...formControlProps}>
        {!!customLabel
          ? (customLabel)
          : (<FormLabel htmlFor={fieldName} _disabled={{ color: 'gray.700' }}>{label}</FormLabel>)
        }
        <ReactInputMask ref={inputRef} defaultValue={defaultValue} {...rest}>
          {() => (
            <Input
              id={fieldName}
              placeholder={placeholder}
              isDisabled={disabled}
              _disabled={{ bg: 'gray.100' }}
            />
          )}
        </ReactInputMask>
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    </>
  )
}

export default InputMask
