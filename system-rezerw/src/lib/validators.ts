// ============================================================
// WALIDACJA FORMULARZY
// ============================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

function required(value: string, field: string, label: string): ValidationError | null {
  if (!value || value.trim() === '') {
    return { field, message: `${label} jest wymagane` };
  }
  return null;
}

function email(value: string, field: string): ValidationError | null {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(value)) {
    return { field, message: 'Podaj prawidłowy adres email' };
  }
  return null;
}

function phone(value: string, field: string): ValidationError | null {
  const cleaned = value.replace(/\s/g, '');
  const regex = /^(\+48)?[0-9]{9}$/;
  if (!regex.test(cleaned)) {
    return { field, message: 'Podaj prawidłowy numer telefonu (9 cyfr)' };
  }
  return null;
}

export function validateBookingContact(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  const checks = [
    required(data.firstName, 'firstName', 'Imię'),
    required(data.lastName, 'lastName', 'Nazwisko'),
    required(data.email, 'email', 'Email'),
    required(data.phone, 'phone', 'Telefon'),
  ];

  checks.forEach(e => e && errors.push(e));

  if (data.email) {
    const emailError = email(data.email, 'email');
    if (emailError) errors.push(emailError);
  }

  if (data.phone) {
    const phoneError = phone(data.phone, 'phone');
    if (phoneError) errors.push(phoneError);
  }

  return { valid: errors.length === 0, errors };
}

export function validateService(data: {
  name: string;
  description: string;
  duration: number;
  price: number;
}): ValidationResult {
  const errors: ValidationError[] = [];

  const nameErr = required(data.name, 'name', 'Nazwa');
  if (nameErr) errors.push(nameErr);

  const descErr = required(data.description, 'description', 'Opis');
  if (descErr) errors.push(descErr);

  if (!data.duration || data.duration < 5) {
    errors.push({ field: 'duration', message: 'Czas trwania musi wynosić minimum 5 minut' });
  }

  if (!data.price || data.price < 0) {
    errors.push({ field: 'price', message: 'Cena musi być liczbą nieujemną' });
  }

  return { valid: errors.length === 0, errors };
}

export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find(e => e.field === field)?.message;
}
