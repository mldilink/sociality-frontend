'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, UploadCloud, X } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { useRouter } from 'next/navigation';
import { createPost } from '@/features/posts/api';

export default function AddPostPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [imageError, setImageError] = useState(false);
  const [captionError, setCaptionError] = useState(false);
  const [caption, setCaption] = useState('');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function handleImageChange(file?: File) {
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Format gambar harus JPG, PNG, atau WEBP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 5 MB.');
      return;
    }

    setImageError(false);

    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit() {
    const hasImage = Boolean(image);
    const hasCaption = Boolean(caption.trim());

    setImageError(!hasImage);
    setCaptionError(!hasCaption);

    if (!image || !caption.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await createPost(image, caption.trim());

      URL.revokeObjectURL(preview);
      router.push('/feed?success=post-created');
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to create post.'
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
          <Link href='/'>
            <ArrowLeft size={24} />
          </Link>
          <span className='text-base font-bold'>Add Post</span>
        </div>
      </header>

      {/* Add Post Form */}
      <section className='mx-auto flex w-full max-w-113 flex-col gap-6 px-4 pb-12 pt-8 md:px-0 md:pt-30'>
        <div className='hidden items-center gap-3 md:flex'>
          <Link href='/'>
            <ArrowLeft size={32} />
          </Link>
          <h1 className='text-2xl font-bold'>Add Post</h1>
        </div>

        <div className='hidden md:block'>
          <Navbar />
        </div>
        <form className='flex flex-col gap-4'>
          {/* Photo Upload */}
          <label className='text-sm font-bold leading-7'>Photo</label>
          <div
            className={`flex w-full flex-col items-center rounded-xl border-2 border-dashed bg-neutral-950 px-6 py-4 ${
              imageError ? 'border-[#B41759]' : 'border-neutral-900'
            } ${preview ? 'min-h-129.75' : 'min-h-36 justify-center'}`}
          >
            <input
              ref={fileInputRef}
              type='file'
              accept='image/jpeg,image/png,image/webp'
              className='hidden'
              onChange={(event) => handleImageChange(event.target.files?.[0])}
            />

            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='flex min-h-36 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-neutral-900 bg-neutral-950 px-6 py-4'
            >
              {preview ? (
                <div className='flex w-full flex-col items-center gap-3'>
                  <div className='relative aspect-square w-full max-w-98.75 overflow-hidden'>
                    <Image
                      src={preview}
                      alt='Preview gambar'
                      fill
                      unoptimized
                      className='object-cover'
                    />
                  </div>

                  <div className='flex items-center gap-3'>
                    <button
                      type='button'
                      onClick={() => fileInputRef.current?.click()}
                      className='flex h-10 justify-center items-center gap-2 rounded-lg bg-neutral-border-neutral-900 px-3 text-sm'
                    >
                      <Image
                        src='/icons/Phase-arrow.svg'
                        alt=''
                        width={20}
                        height={20}
                      />
                      Change Image
                    </button>

                    <button
                      type='button'
                      onClick={() => {
                        URL.revokeObjectURL(preview);
                        setImage(null);
                        setPreview('');
                      }}
                      className='flex h-10 justify-center items-center gap-2 rounded-lg bg-neutral-border-neutral-900 text-accent-red px-3 text-sm'
                    >
                      <Image
                        src='/icons/Trash.svg'
                        alt=''
                        width={20}
                        height={20}
                      />
                      Delete Image
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className='flex size-10 items-center justify-center rounded-lg border border-neutral-900'>
                    <UploadCloud size={20} />
                  </span>

                  <span className='text-center text-sm'>
                    <span className='font-bold text-primary-200'>
                      Click to upload
                    </span>
                    <span className='text-neutral-600'> or drag and drop</span>
                  </span>

                  <span className='text-center text-sm text-neutral-600'>
                    JPG or PNG (max. 5MB)
                  </span>
                </>
              )}
            </button>

            {image && (
              <div className='mt-2 flex items-center justify-between text-sm text-neutral-400'>
                <span className='truncate'>{image.name}</span>
                <button
                  type='button'
                  onClick={() => {
                    URL.revokeObjectURL(preview);
                    setImage(null);
                    setPreview('');
                  }}
                  aria-label='Hapus gambar'
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          {imageError && (
            <p className='text-sm leading-7 tracking-[-0.03em] text-[#B41759]'>
              Please upload a photo.
            </p>
          )}

          {/* Caption */}
          <div className='flex w-full flex-col gap-0.5'>
            <label htmlFor='caption' className='text-sm font-bold leading-7'>
              Caption
            </label>

            <textarea
              id='caption'
              placeholder='Create your caption'
              value={caption}
              onChange={(event) => {
                setCaption(event.target.value);
                if (event.target.value.trim()) {
                  setCaptionError(false);
                }
              }}
              className={`h-25.25 w-full resize-none rounded-xl border-2 bg-neutral-950 px-4 py-2 text-base text-neutral-25 outline-none placeholder:text-neutral-600 ${
                captionError
                  ? 'border-[#B41759]'
                  : 'border-neutral-900 focus:border-primary-text-primary-200'
              }`}
            />

            {captionError && (
              <p className='text-sm leading-7 tracking-[-0.03em] text-[#B41759]'>
                Please enter a caption.
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type='button'
            onClick={handleSubmit}
            disabled={isSubmitting}
            className='h-10 w-full rounded-full bg-primary-300 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-50'
          >
            {isSubmitting ? 'Sharing...' : 'Share'}
          </button>
        </form>
      </section>
    </main>
  );
}
