import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'Informe o usuário').max(100),
  password: z.string().min(1, 'Informe a senha').max(200),
})

export const doctorSchema = z.object({
  name: z.string().trim().min(3, 'Nome muito curto').max(200),
  crm: z.string().trim().min(3, 'CRM inválido').max(50),
  rqe: z
    .string()
    .trim()
    .max(50)
    .optional()
    .nullable()
    .transform((v) => (v === '' ? null : v)),
  photoUrl: z
    .string()
    .trim()
    .url('URL da foto inválida')
    .max(1000)
    .optional()
    .nullable()
    .transform((v) => (v === '' ? null : v)),
  areas: z
    .array(z.string().trim().min(1).max(100))
    .min(1, 'Informe ao menos uma especialidade')
    .max(20, 'Máximo de 20 especialidades'),
  minAge: z
    .number()
    .int()
    .min(0)
    .max(120)
    .optional()
    .nullable(),
  allAges: z.boolean().default(true),
  displayOrder: z.number().int().min(0).max(9999).default(0),
})

export type DoctorInput = z.infer<typeof doctorSchema>
export type LoginInput = z.infer<typeof loginSchema>
