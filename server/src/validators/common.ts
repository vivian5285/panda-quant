export const commonValidators = {
  email: {
    field: 'email',
    validators: [
      (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      }
    ]
  },
  password: {
    field: 'password',
    validators: [
      (value: string) => value.length >= 6,
      (value: string) => /[A-Z]/.test(value),
      (value: string) => /[a-z]/.test(value),
      (value: string) => /[0-9]/.test(value)
    ]
  },
  requiredString: (field: string) => ({
    field,
    validators: [
      (value: string) => value && value.trim().length > 0
    ]
  })
}; 