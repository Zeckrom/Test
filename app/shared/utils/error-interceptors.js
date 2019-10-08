export const errorsExtraction = errors =>
  Object.keys(errors).reduce(
    (acc, errorKey) => [...acc, ...errors[errorKey]],
    [],
  )
