declare module 'Yup' {
  interface ArraySchema<T> {
    unique(message: string): ArraySchema<T>
  }
}
