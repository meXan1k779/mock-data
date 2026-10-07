import clsx from 'clsx';
import { useState } from 'react';

interface ReplyFormProps {
  onSubmit: (text: string) => void;
  onCancel: () => void;
}

export function ReplyForm({ onSubmit, onCancel }: ReplyFormProps) {
  const [text, setText] = useState('');
  const hasText = text.trim().length > 0;

  return (
    <div className="pt-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
        rows={3}
        placeholder="Tulis balasan..."
        className="w-full px-4 py-3 border border-border-tetriary focus:border-base-link rounded-xl text-sm text-content-primary font-noto resize-none outline-none transition-colors mb-2"
      />
      <div className="flex gap-2">
        <button
          onClick={() => hasText && onSubmit(text.trim())}
          disabled={!hasText}
          className={clsx(
            'btn btn--md rounded-lg font-medium transition-all',
            hasText
              ? 'btn--primary cursor-pointer'
              : 'btn--secondary text-content-black-diabled cursor-not-allowed',
          )}
        >
          Kirim
        </button>
        <button onClick={onCancel} className="btn btn--md btn--secondary rounded-lg">
          Batal
        </button>
      </div>
    </div>
  );
}
