export const customFormErrorMessages = {
  email: {
    email: 'Incorrect email',
    pattern: 'Incorrect email',
    required: 'Email is required',
    emailDuplicateValidate: 'Account with this email already exists',
    userNotFound: 'Incorrect email or password',
  },
  password: {
    required: 'Password is required',
    minlength: 'Password must be at least 8 characters long',
    userNotFound: 'Incorrect email or password',
  },
  confirmPassword: {
    required: 'Please repeat the password',
    mismatch: 'Passwords do not match',
  },
};
