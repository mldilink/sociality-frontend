'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';

import { loginUser } from '@/features/auth/api';
import { saveSession } from '@/features/auth/auth-storage';
import { loginSchema, type LoginInput } from '@/features/auth/schemas';
import { ApiError } from '@/lib/api/client';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    clearErrors();

    try {
      const response = await loginUser(data);

      saveSession(response.data.token, response.data.user);

      router.push('/');
      router.refresh();
    } catch (error) {
      setError('root.server', {
        message:
          error instanceof ApiError
            ? error.message
            : 'Login gagal. Periksa koneksi dan coba lagi.',
      });
    }
  };

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

      {/* Login card */}
      <section className='relative z-10 flex w-full max-w-111.5 flex-col items-center gap-xl rounded-2xl border border-neutral-900 bg-black/20 px-xl py-8 backdrop-blur-xl md:gap-2xl md:px-2xl md:py-4xl'>
        <div className='flex h-9 items-center gap-2.75'>
          <Image src='/icons/Logo.svg' alt='Sociality' width={30} height={30} />
          <span className='text-display-xs font-bold'>Sociality</span>
        </div>

        <h1 className='text-text-xl font-bold tracking-[-0.02em] md:text-display-xs'>
          Welcome Back!
        </h1>

        <form
          className='flex w-full flex-col gap-2xl'
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className='flex flex-col gap-xxs'>
            <label
              htmlFor='email'
              className='text-text-sm font-bold tracking-[-0.02em]'
            >
              Email
            </label>

            <input
              id='email'
              type='email'
              autoComplete='email'
              placeholder='Enter your email'
              aria-invalid={Boolean(errors.email)}
              {...register('email')}
              className='h-12 w-full rounded-xl border border-neutral-900 bg-neutral-950 px-xl text-text-md tracking-[-0.02em] outline-none placeholder:text-neutral-600 focus:border-primary-200 focus:ring-1 focus:ring-primary-200 aria-invalid:border-accent-red'
            />

            {errors.email && (
              <p className='text-text-xs text-accent-red' role='alert'>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-xxs'>
            <label
              htmlFor='password'
              className='text-text-sm font-bold tracking-[-0.02em]'
            >
              Password
            </label>

            <div className='flex h-12 items-center gap-md rounded-xl border border-neutral-900 bg-neutral-950 px-xl focus-within:border-primary-200 focus-within:ring-1 focus-within:ring-primary-200'>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                autoComplete='current-password'
                placeholder='Enter your password'
                aria-invalid={Boolean(errors.password)}
                {...register('password')}
                className='min-w-0 flex-1 bg-transparent text-text-md tracking-[-0.02em] outline-none placeholder:text-neutral-600'
              />

              <button
                type='button'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((visible) => !visible)}
                className='shrink-0 text-neutral-500 transition-colors hover:text-foreground'
              >
                {showPassword ? (
                  <EyeOff className='size-5' aria-hidden='true' />
                ) : (
                  <Eye className='size-5' aria-hidden='true' />
                )}
              </button>
            </div>

            {errors.password && (
              <p className='text-text-xs text-accent-red' role='alert'>
                {errors.password.message}
              </p>
            )}
          </div>

          {errors.root?.server && (
            <p className='text-text-sm text-accent-red' role='alert'>
              {errors.root.server.message}
            </p>
          )}

          <div className='flex flex-col items-center gap-xl'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='h-11 w-full rounded-full bg-primary px-xl text-text-md font-bold tracking-[-0.02em] transition-colors hover:bg-primary-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60 md:h-12'
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>

            <p className='text-center text-text-sm font-semibold tracking-[-0.02em] md:text-text-md'>
              Don&apos;t have an account?{' '}
              <Link
                href='/register'
                className='font-bold text-primary-200 transition-colors hover:text-primary-300'
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}
