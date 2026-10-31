'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getMyProfile, updateMyProfile } from '@/features/users/api';
import type { MyProfile } from '@/features/users/types';
import { setUser, getUser } from '@/features/auth/auth-storage';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await getMyProfile();

        if (!response.success) {
          throw new Error(response.message);
        }

        const user = response.data.profile;

        setProfile(user);
        setUsername(user.username);
        setPhone(user.phone ?? '');
        setBio(user.bio ?? '');
        setPreview(user.avatarUrl ?? '');
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to load profile.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  function handleAvatarChange(file?: File) {
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Format gambar harus JPG, PNG, atau WEBP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 5 MB.');
      return;
    }

    if (preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    setAvatar(file);
    setPreview(URL.createObjectURL(file));
    setError('');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await updateMyProfile({
        username: username.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        ...(avatar && { avatar }),
      });

      console.log('Update profile response:', response);
      if (!response.success) {
        throw new Error(response.message);
      }

      const updatedProfile = response.data;

      setProfile(updatedProfile);
      setAvatar(null);

      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }

      setPreview(updatedProfile.avatarUrl ?? '');

      const currentUser = getUser();

      if (currentUser) {
        setUser({
          ...currentUser,
          avatarUrl: updatedProfile.avatarUrl,
        });
      }

      window.dispatchEvent(new Event('profile-updated'));

      router.push('/me?success=profile-updated');
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to update profile.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className='min-h-screen bg-black text-neutral-25'>
      {/* Mobile Header */}
      <header className='flex h-16 items-center justify-between border-b border-neutral-900 px-4 md:hidden'>
        <div className='flex items-center gap-2'>
          <Link href='/me' aria-label='Back'>
            <ArrowLeft size={24} />
          </Link>
          <h1 className='text-base font-bold'>Edit Profile</h1>
        </div>

        <div className='relative size-10 overflow-hidden rounded-full bg-neutral-border-neutral-900'>
          {preview && (
            <Image
              src={preview}
              alt='Profile avatar'
              fill
              unoptimized
              className='object-cover'
            />
          )}
        </div>
      </header>

      <section className='mx-auto flex w-full max-w-200 flex-col gap-8 px-4 pb-12 pt-8 md:px-0 md:pt-30'>
        {/* Desktop Title */}
        <div className='hidden items-center gap-3 md:flex'>
          <Link href='/me' aria-label='Back'>
            <ArrowLeft size={32} />
          </Link>
          <h1 className='text-2xl font-bold'>Edit Profile</h1>
        </div>

        <div className='flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-12'>
          {/* Avatar */}
          <div className='flex w-40 shrink-0 flex-col items-center gap-4'>
            <div className='relative size-20 overflow-hidden rounded-full bg-neutral-border-neutral-900 md:size-32.5'>
              {preview && (
                <Image
                  src={preview}
                  alt='Profile preview'
                  fill
                  unoptimized
                  className='object-cover'
                />
              )}
            </div>

            <input
              ref={fileInputRef}
              type='file'
              accept='image/jpeg,image/png,image/webp'
              className='hidden'
              onChange={(event) => handleAvatarChange(event.target.files?.[0])}
            />

            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='flex h-10 w-40 items-center justify-center rounded-full border border-neutral-900 text-sm font-bold md:h-12 md:text-base'
            >
              Change Photo
            </button>
          </div>

          {/* Profile Form */}
          {isLoading && (
            <p className='text-sm text-neutral-400'>Loading profile...</p>
          )}
          <form
            onSubmit={handleSubmit}
            className='flex w-full flex-col gap-4 md:w-148 md:gap-6'
          >
            {/* Name */}
            <div className='flex w-full flex-col gap-0.5'>
              <label className='text-sm font-bold leading-7'>Name</label>
              <input
                type='text'
                value={profile?.name ?? ''}
                readOnly
                className='h-12 w-full rounded-xl border border-neutral-900 bg-neutral-950 px-4 text-base text-neutral-25 outline-none'
              />
            </div>

            {/* Username */}
            <div className='flex w-full flex-col gap-0.5'>
              <label htmlFor='username' className='text-sm font-bold leading-7'>
                Username
              </label>
              <input
                id='username'
                type='text'
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className='h-12 w-full rounded-xl border border-neutral-900 bg-neutral-950 px-4 text-base text-neutral-25 outline-none focus:border-primary-200'
              />
            </div>

            {/* Email */}
            <div className='flex w-full flex-col gap-0.5'>
              <label className='text-sm font-bold leading-7'>Email</label>
              <input
                type='email'
                value={profile?.email ?? ''}
                readOnly
                className='h-12 w-full rounded-xl border border-neutral-900 bg-neutral-950 px-4 text-base text-neutral-25 outline-none'
              />
            </div>

            {/* Number Phone */}
            <div className='flex w-full flex-col gap-0.5'>
              <label htmlFor='phone' className='text-sm font-bold leading-7'>
                Number Phone
              </label>
              <input
                id='phone'
                type='tel'
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className='h-12 w-full rounded-xl border border-neutral-900 bg-neutral-950 px-4 text-base text-neutral-25 outline-none focus:border-primary-200'
              />
            </div>

            {/* Bio */}
            <div className='flex w-full flex-col gap-0.5'>
              <label htmlFor='bio' className='text-sm font-bold leading-7'>
                Bio
              </label>
              <textarea
                id='bio'
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                className='h-25.25 w-full resize-none rounded-xl border border-neutral-900 bg-neutral-950 px-4 py-2 text-base text-neutral-25 outline-none focus:border-primary-200'
              />
            </div>

            {/* Error & Success */}
            {error && <p className='text-sm text-[#B41759]'>{error}</p>}

            {success && <p className='text-sm text-accent-green'>{success}</p>}

            {/* Submit */}
            <button
              type='submit'
              disabled={isLoading || isSubmitting}
              className='h-10 w-full rounded-full bg-primary-300 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 md:h-12 md:text-base'
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
