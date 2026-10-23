import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Nama wajib diisi'),
    username: z.string().trim().min(1, 'Username wajib diisi'),
    email: z
      .string()
      .trim()
      .min(1, 'Email wajib diisi')
      .email('Format email tidak valid'),
    phone: z.string().trim().min(1, 'Nomor telepon wajib diisi'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak sama',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().trim().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
