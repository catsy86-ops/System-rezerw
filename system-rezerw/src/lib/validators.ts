import { z } from 'zod';

export const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Wybierz usługę'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Nieprawidłowy format daty'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Nieprawidłowy format godziny'),
  firstName: z.string().min(2, 'Imię musi mieć min. 2 znaki'),
  lastName: z.string().min(2, 'Nazwisko musi mieć min. 2 znaki'),
  email: z.string().email('Nieprawidłowy adres e-mail'),
  phone: z.string().min(9, 'Numer telefonu jest za krótki'),
  notes: z.string().optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(3, 'Nazwa musi mieć min. 3 znaki'),
  description: z.string().min(10, 'Opis musi mieć min. 10 znaków'),
  duration: z.number().min(5, 'Minimalny czas trwania to 5 min'),
  price: z.number().min(0, 'Cena nie może być ujemna'),
  category: z.enum(['wódka', 'piwo', 'wino', 'whisky', 'przekąski', 'inne']),
  icon: z.string().min(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Nieprawidłowy kolor HEX'),
  active: z.boolean(),
});

export type ValidationError = {
  field: string;
  message: string;
};

export const contactSchema = z.object({
  firstName: z.string().min(2, 'Imię musi mieć min. 2 znaki'),
  lastName: z.string().min(2, 'Nazwisko musi mieć min. 2 znaki'),
  email: z.string().email('Nieprawidłowy adres e-mail'),
  phone: z.string().min(9, 'Numer telefonu jest za krótki'),
});

export function validateBookingContact(data: any) {
  const result = contactSchema.safeParse(data);
  if (result.success) {
    return { valid: true, errors: [] as ValidationError[] };
  } else {
    const errors = result.error.issues.map(err => ({
      field: err.path[0] as string,
      message: err.message
    }));
    return { valid: false, errors };
  }
}

export function validateService(data: any) {
  const result = serviceSchema.safeParse(data);
  if (result.success) {
    return { valid: true, errors: [] as ValidationError[] };
  } else {
    const errors = result.error.issues.map(err => ({
      field: err.path[0] as string,
      message: err.message
    }));
    return { valid: false, errors };
  }
}

export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find(e => e.field === field)?.message;
}
