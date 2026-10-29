'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Smile } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addComment, getComments } from '@/features/posts/api';
import type { Post } from '@/features/posts/types';

interface CommentsModalProps {
  post: Post;
  onClose: () => void;
}

export function CommentsModal({ post, onClose }: CommentsModalProps) {
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { data, isPending, isError } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => getComments(post.id),
  });

  const commentMutation = useMutation({
    mutationFn: () => addComment(post.id, text.trim()),
    onSuccess: async () => {
      setText('');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['comments', post.id],
        }),
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
      ]);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!text.trim() || commentMutation.isPending) return;

    commentMutation.mutate();
  }

  return (
    <div
      className='fixed inset-0 z-100 flex items-end justify-center bg-neutral-950/80 md:items-center md:overflow-y-auto md:p-6'
      onClick={onClose}
    >
      <section
        role='dialog'
        aria-modal='true'
        aria-label='Komentar postingan'
        className='flex h-142.5 w-full max-w-98.25 shrink-0 flex-col gap-2 overflow-hidden rounded-t-2xl bg-neutral-950 px-4 pb-8 pt-4 md:h-192 md:w-full md:max-w-300 md:gap-6 md:rounded-none md:bg-transparent md:p-0'
        onClick={(event) => event.stopPropagation()}
      >
        <div className='flex h-6 shrink-0 justify-end'>
          <button
            type='button'
            onClick={onClose}
            aria-label='close comment'
            className='text-neutral-25'
          >
            <X size={24} />
          </button>
        </div>

        <div className='flex min-h-0 flex-1 flex-col overflow-hidden bg-neutral-950 md:h-180 md:max-w-300 md:flex-row md:flex-none'>
          <div className='relative hidden min-h-0 flex-1 bg-neutral-900 md:block md:h-180 md:min-w-87.5 xl:w-180'>
            <Image
              src={post.imageUrl}
              alt={post.caption || `Postingan ${post.author.username}`}
              fill
              sizes='720px'
              className='object-cover'
            />
          </div>

          <div className='flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden bg-neutral-950 p-4 md:h-180 md:w-120 md:flex-none md:gap-6 md:p-5'>
            <div className='flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto'>
              <header className='flex shrink-0 items-center gap-3'>
                <div className='relative size-10 shrink-0 overflow-hidden rounded-full bg-neutral-900'>
                  {post.author.avatarUrl && (
                    <Image
                      src={post.author.avatarUrl}
                      alt={`Avatar ${post.author.username}`}
                      fill
                      sizes='40px'
                      className='object-cover'
                    />
                  )}
                </div>

                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-bold text-neutral-25'>
                    {post.author.username}
                  </p>
                  <time className='text-xs text-neutral-400'>
                    {new Date(post.createdAt).toLocaleDateString('id-ID')}
                  </time>
                </div>
              </header>

              {post.caption && (
                <p className='wrap-break-words text-sm leading-7 text-neutral-25'>
                  <span className='mr-2 font-bold'>{post.author.username}</span>
                  {post.caption}
                </p>
              )}

              <div className='border-t border-neutral-900 pt-3'>
                <h2 className='mb-3 text-base font-bold text-neutral-25'>
                  Comments
                </h2>

                {isPending && (
                  <p className='text-sm text-neutral-400'>Memuat komentar...</p>
                )}

                {isError && (
                  <p className='text-sm text-red-400'>Gagal memuat komentar.</p>
                )}

                <div className='flex flex-col gap-3'>
                  {data?.data.comments.length === 0 && (
                    <div className='flex h-38.75 w-full flex-col items-center justify-center'>
                      <p className='text-sm font-semibold text-neutral-25'>
                        No Comments yet
                      </p>
                      <p className='mt-1 text-xs text-neutral-400'>
                        Start the conversation
                      </p>
                    </div>
                  )}

                  {data?.data.comments.map((comment) => (
                    <article
                      key={comment.id}
                      className='flex gap-2 border-b border-neutral-900 pb-3'
                    >
                      <div className='relative size-10 shrink-0 overflow-hidden rounded-full bg-neutral-900'>
                        {comment.author.avatarUrl && (
                          <Image
                            src={comment.author.avatarUrl}
                            alt={`Avatar ${comment.author.username}`}
                            fill
                            sizes='40px'
                            className='object-cover'
                          />
                        )}
                      </div>

                      <div className='min-w-0 flex-1'>
                        <p className='text-xs text-neutral-400 md:text-sm'>
                          <span className='mr-2 font-semibold text-neutral-25'>
                            {comment.author.username}
                          </span>
                          {new Date(comment.createdAt).toLocaleDateString(
                            'id-ID'
                          )}
                        </p>
                        <p className='wrap-break-words text-xs leading-6 text-neutral-25 md:text-sm md:leading-7'>
                          {comment.text}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='flex shrink-0 gap-2'>
              <div className='relative shrink-0'>
                <button
                  type='button'
                  aria-label='Pilih emoji'
                  aria-expanded={showEmojiPicker}
                  onClick={() => setShowEmojiPicker((visible) => !visible)}
                  className='flex size-12 items-center justify-center rounded-xl border border-neutral-900 text-neutral-25'
                >
                  <Smile size={24} />
                </button>

                {showEmojiPicker && (
                  <div className='absolute bottom-full left-0 z-20 mb-2 flex h-38 w-52.5 items-center justify-center rounded-xl border border-neutral-900 bg-neutral-950 p-4'>
                    <div className='grid grid-cols-6 gap-2.5'>
                      {[
                        '😀',
                        '😅',
                        '🥰',
                        '😇',
                        '🙂',
                        '😋',
                        '🤪',
                        '🤐',
                        '😏',
                        '🤗',
                        '😪',
                        '🙄',
                        '🤫',
                        '😴',
                        '🥵',
                        '😫',
                        '😭',
                        '😱',
                      ].map((emoji) => (
                        <button
                          key={emoji}
                          type='button'
                          aria-label={`Masukkan emoji ${emoji}`}
                          onClick={() => {
                            setText((current) => current + emoji);
                            setShowEmojiPicker(false);
                          }}
                          className='flex size-6 items-center justify-center text-2xl leading-10 hover:scale-110'
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className='flex h-12 min-w-0 flex-1 items-center gap-2 rounded-xl border border-neutral-900 px-3 md:px-4'>
                <input
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder='Add Comment'
                  aria-label='Add Comment'
                  className='min-w-0 flex-1 bg-transparent text-sm text-neutral-25 outline-none placeholder:text-neutral-600 md:text-base'
                />
                <button
                  type='submit'
                  disabled={!text.trim() || commentMutation.isPending}
                  className='text-sm font-bold text-primary-200 disabled:text-neutral-600 md:text-base'
                >
                  Post
                </button>
              </div>
            </form>

            {commentMutation.isError && (
              <p className='shrink-0 text-xs text-red-400'>
                Gagal mengirim komentar. Silakan coba lagi.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
