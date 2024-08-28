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
  leftColumns: {
    min: 'Too few columns',
    pattern: 'Columns must be integers',
    required: 'Columns is required',
    minSumRows: 'Too few columns in total',
    maxSumRows: 'Too many columns in total',
  },
  rightColumns: {
    min: 'Too few columns',
    pattern: 'Columns must be integers',
    required: 'Right columns is required',
    minSumRows: 'Too few columns in total',
    maxSumRows: 'Too many columns in total',
  },
};
