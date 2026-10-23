'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addComment, getComments } from '@/features/posts/api';

interface CommentSectionProps {
  postId: number;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [text, setText] = useState('');
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
  });

  const commentMutation = useMutation({
    mutationFn: () => addComment(postId, text.trim()),
    onSuccess: async () => {
      setText('');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['comments', postId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['posts'],
        }),
      ]);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const comment = text.trim();

    if (!comment || commentMutation.isPending) return;

    commentMutation.mutate();
  }

  return (
    <section className='mt-3 border-t border-neutral-900 pt-3'>
      <h3 className='mb-3 text-sm font-semibold text-neutral-25'>Komentar</h3>

      {isPending && (
        <p className='text-sm text-neutral-400'>Memuat komentar...</p>
      )}

      {isError && (
        <p className='text-sm text-red-400'>Gagal memuat komentar.</p>
      )}

      {data?.data.comments.map((comment) => (
        <article key={comment.id} className='mb-3 flex gap-2'>
          <div className='min-w-0'>
            <p className='text-sm text-neutral-25'>
              <span className='mr-2 font-bold'>{comment.author.username}</span>
              {comment.text}
            </p>
            <time className='text-xs text-neutral-400'>
              {new Date(comment.createdAt).toLocaleDateString('id-ID')}
            </time>
          </div>
        </article>
      ))}

      <form onSubmit={handleSubmit} className='flex gap-2'>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder='Tambahkan komentar...'
          aria-label='Tulis komentar'
          className='min-w-0 flex-1 rounded-md border border-neutral-900 bg-transparent px-3 py-2 text-sm text-neutral-25 outline-none placeholder:text-neutral-400 focus:border-primary-200'
        />
        <button
          type='submit'
          disabled={!text.trim() || commentMutation.isPending}
          className='text-sm font-semibold text-primary-200 disabled:opacity-50'
        >
          Kirim
        </button>
      </form>

      {commentMutation.isError && (
        <p className='mt-2 text-sm text-red-400'>
          Gagal mengirim komentar. Silakan coba lagi.
        </p>
      )}
    </section>
  );
}
