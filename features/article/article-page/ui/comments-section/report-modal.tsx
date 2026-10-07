import clsx from 'clsx';
import { useState } from 'react';

import { COMMENT_REPORT_REASONS } from '@/shared/constants/comment-report-reasons';
import { RadioGroup } from '@/shared/ui/radio-group';

interface ReportModalProps {
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export function ReportModal({ onClose, onSubmit }: ReportModalProps) {
  const [reason, setReason] = useState('');

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center"
      style={{ background: 'rgba(17,25,40,0.48)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal — точно по Figma: rounded-16, shadow drop 1px #E6E6E6 */}
      <div
        className="bg-white rounded-2xl w-[520px] max-w-[calc(100vw-32px)]"
        style={{ boxShadow: '0px 1px 0px #E6E6E6, 0 8px 24px rgba(0,0,0,0.12)' }}
      >
        {/* Header — pt-16 pb-8 pl-24 pr-16 */}
        <div className="flex items-center gap-4 pt-4 pb-2 pl-6 pr-4">
          <h3 className="flex-1 font-manrope font-bold text-[20px] leading-7 text-content-primary">
            Report this comment?
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background-secondary text-content-secondary cursor-pointer transition-colors flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M11 3L3 11M3 3l8 8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Content — pt-8 pb-24 px-24, gap-24 между subtitle и options, gap-24 между options и кнопками */}
        <div className="flex flex-col gap-6 pt-2 pb-6 px-6">
          {/* Subtitle */}
          <p className="text-base text-content-primary leading-6">
            Let us know why you think this comment should be reported.
          </p>

          {/* Radio options — через компонент RadioGroup из ДС */}
          <RadioGroup
            name="report-reason"
            value={reason}
            onChange={setReason}
            radioClassName="items-start"
            options={COMMENT_REPORT_REASONS.map((opt) => ({
              value: opt.value,
              label: <span className="text-base text-content-primary leading-6">{opt.label}</span>,
            }))}
          />

          <div className="flex flex-col-reverse gap-[15px] sm:flex-row">
            <button
              onClick={onClose}
              className="flex-1 btn btn--secondary rounded-lg font-medium text-base py-4 px-6"
            >
              Batal
            </button>
            <button
              onClick={() => reason && onSubmit(reason)}
              disabled={!reason}
              className={clsx(
                'flex-1 btn rounded-lg font-medium text-base py-4 px-6',
                reason
                  ? 'btn--primary cursor-pointer'
                  : 'bg-primary-bg-disabled text-content-black-diabled cursor-not-allowed',
              )}
            >
              Kirim Laporan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
