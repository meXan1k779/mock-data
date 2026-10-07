export const validateBirthDate = (value: string, minAge: number = 18): true | string => {
  if (!value) {
    return true;
  }

  const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
  if (!dateRegex.test(value)) {
    return 'Invalid date format. Use DD.MM.YYYY';
  }

  const [day, month, year] = value.split('.').map(Number);
  const date = new Date(year, month - 1, day);

  const isValidDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  if (!isValidDate) {
    return 'Invalid date';
  }

  const today = new Date();
  let age = today.getFullYear() - year;
  const monthDiff = today.getMonth() - (month - 1);
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
    age--;
  }

  if (age < minAge) {
    return `Minimal ${minAge} tahun.`;
  }

  return true;
};
