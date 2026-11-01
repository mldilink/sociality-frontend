'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUser } from '@/features/auth/api';
import { registerSchema, type RegisterInput } from '@/features/auth/schemas';
import { ApiError } from '@/lib/api/client';

const fields = [
  { name: 'name', label: 'Name', placeholder: 'Enter your name', type: 'text' },
  {
    name: 'username',
    label: 'Username',
    placeholder: 'Enter your username',
    type: 'text',
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
  },
  {
    name: 'phone',
    label: 'Number Phone',
    placeholder: 'Enter your phone number',
    type: 'tel',
  },
] as const;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: RegisterInput) {
    clearErrors();

    try {
      await registerUser(data);
      router.push('/login?registered=true');
    } catch (error) {
      setError('root.server', {
        message:
          error instanceof ApiError
            ? error.message
            : 'Registrasi gagal. Periksa koneksi dan coba lagi.',
      });
    }
  }

  return (
    <main className='relative flex min-h-dvh items-center justify-center overflow-hidden bg-black px-xl py-8 text-white'>
      {/* Background gradient */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -bottom-80 left-1/2 h-162.5 w-275 -translate-x-1/2 rounded-full bg-[#5613A3]/80 blur-[150px] md:h-212.5 md:w-350'
      />

      <div
        aria-hidden='true'
        className='pointer-events-none absolute -bottom-72 left-1/4 h-125 w-175 rotate-45 rounded-full bg-[#AD3AE7]/70 blur-[150px]'
      />

      {/* Register card */}
      <section className='relative z-10 flex w-full max-w-130 flex-col items-center gap-xl rounded-2xl border border-neutral-900 bg-black/20 px-xl py-8 backdrop-blur-[50px] md:gap-2xl md:px-2xl md:py-4xl'>
        {/* Brand */}
        <div className='flex h-9 items-center gap-2.75'>
          <Image src='/icons/Logo.svg' alt='Sociality' width={30} height={30} />
          <span className='text-display-xs font-bold'>Sociality</span>
        </div>

        <h1 className='text-center text-display-xs font-bold'>Register</h1>

        <form
          className='flex w-full flex-col gap-2xl'
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {fields.map((field) => (
            <div key={field.name} className='flex w-full flex-col gap-xxs'>
              <label
                htmlFor={field.name}
                className='text-text-sm font-bold tracking-[-0.02em]'
              >
                {field.label}
              </label>

              <input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                autoComplete={
                  field.name === 'name'
                    ? 'name'
                    : field.name === 'username'
                      ? 'username'
                      : field.name === 'email'
                        ? 'email'
                        : 'tel'
                }
                {...register(field.name)}
                aria-invalid={Boolean(errors[field.name])}
                className='h-12 w-full rounded-xl border border-neutral-900 bg-neutral-950 px-xl text-text-md tracking-[-0.02em] outline-none placeholder:text-neutral-600 focus:border-primary-200'
              />

              {errors[field.name]?.message && (
                <p className='text-text-xs text-red-500'>
                  {errors[field.name]?.message}
                </p>
              )}
            </div>
          ))}

          <div className='flex w-full flex-col gap-xxs'>
            <label
              htmlFor='password'
              className='text-text-sm font-bold tracking-[-0.02em]'
            >
              Password
            </label>

            <div className='flex h-12 w-full items-center gap-md rounded-xl border border-neutral-900 bg-neutral-950 px-xl focus-within:border-primary-200'>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                autoComplete='new-password'
                {...register('password')}
                aria-invalid={Boolean(errors.password)}
                className='min-w-0 flex-1 bg-transparent text-text-md tracking-[-0.02em] outline-none placeholder:text-neutral-600'
              />

              <button
                type='button'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((visible) => !visible)}
                className='shrink-0 text-neutral-500 transition-colors hover:text-white'
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password?.message && (
              <p className='text-text-xs text-red-500'>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className='flex w-full flex-col gap-xxs'>
            <label
              htmlFor='confirmPassword'
              className='text-text-sm font-bold tracking-[-0.02em]'
            >
              Confirm Password
            </label>

            <div className='flex h-12 w-full items-center gap-md rounded-xl border border-neutral-900 bg-neutral-950 px-xl focus-within:border-primary-200'>
              <input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Enter your confirm password'
                autoComplete='new-password'
                {...register('confirmPassword')}
                aria-invalid={Boolean(errors.confirmPassword)}
                className='min-w-0 flex-1 bg-transparent text-text-md tracking-[-0.02em] outline-none placeholder:text-neutral-600'
              />

              <button
                type='button'
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                }
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                className='shrink-0 text-neutral-500 transition-colors hover:text-white'
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.confirmPassword?.message && (
              <p className='text-text-xs text-red-500'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className='flex flex-col items-center gap-xl'>
            {errors.root?.server?.message && (
              <p role='alert' className='text-text-xs text-red-500'>
                {errors.root.server.message}
              </p>
            )}

            <button
              type='submit'
              disabled={isSubmitting}
              className='flex h-11 w-full items-center justify-center rounded-full bg-primary px-xl text-text-md font-bold tracking-[-0.02em] transition-colors hover:bg-primary-200 disabled:cursor-not-allowed disabled:opacity-60 md:h-12'
            >
              {isSubmitting ? 'Submiting...' : 'Submit'}
            </button>

            <p className='text-center text-text-sm tracking-[-0.02em] md:text-text-md'>
              Already have an account?{' '}
              <Link
                href='/login'
                className='font-bold text-primary-200 hover:text-primary-300'
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}
