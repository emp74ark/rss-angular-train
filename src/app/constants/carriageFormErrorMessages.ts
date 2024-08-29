export const carriageFormErrorMessages = {
  name: {
    required: 'Name is required',
    nameEmpty: 'Name must not be empty',
    nameDuplicate: 'Name already exist.',
    carriageCodeDuplicateValidate: `Carriage code already exists`,
    codeDuplicate: 'Code may be repeated and cause an error.',
  },
  rows: {
    min: 'Too few rows',
    max: 'Too many rows',
    pattern: 'Rows must be integers',
    required: 'Rows is required',
  },
  leftSeats: {
    min: 'Too few seats',
    pattern: 'Seats must be integers',
    required: 'Seats is required',
    minSumRows: 'Too few seats in row',
    maxSumRows: 'Too many seats in row',
  },
  rightSeats: {
    min: 'Too few seats',
    pattern: 'Seats must be integers',
    required: 'Seats is required',
    minSumRows: 'Too few seats in row',
    maxSumRows: 'Too many seats in row',
  },
};
