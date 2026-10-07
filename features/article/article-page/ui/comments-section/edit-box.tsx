import clsx from 'clsx';
import { useState } from 'react';

interface EditBoxProps {
  initialText: string;
  onSave: (text: string) => void;
  onCancel: () => void;
}

export function EditBox({ initialText, onSave, onCancel }: EditBoxProps) {
  const [text, setText] = useState(initialText);
  const changed = text.trim() !== initialText && text.trim().length > 0;

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
        rows={3}
        className="w-full px-4 py-3 border border-border-tetriary focus:border-base-link rounded-xl text-sm text-content-primary font-noto resize-none outline-none transition-colors mb-2"
      />
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => changed && onSave(text.trim())}
          className={clsx(
            'btn btn--md rounded-lg font-medium transition-all',
            changed
              ? 'btn--primary cursor-pointer'
              : 'btn--secondary text-content-black-diabled cursor-not-allowed',
          )}
        >
          Simpan perubahan
        </button>
        <button onClick={onCancel} className="btn btn--md btn--secondary rounded-lg">
          Batal
        </button>
      </div>
    </div>
  );
}
