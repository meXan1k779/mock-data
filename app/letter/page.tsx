import { Button } from '@/shared/ui/button';

export default function LetterPage() {
  return (
    <div className="flex justify-center items-center flex-col px-10">
      <div className="max-w-[520px] flex justify-center flex-col px-2">
        <header className="w-full flex justify-between py-4 mt-4 mb-10">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="107" height="32" fill="none">
              <path
                fill="#109f12"
                d="m14.066 24.73-5.333 5.333L0 21.331V10.664zM7.247 14.078 1.914 8.745 10.666 0h10.667zM10.672 31.999h10.667l8.72-8.728-5.333-5.334zM17.922 7.26l5.333-5.334 8.74 8.74v10.666z"
              />
              <path fill="#fbc02d" d="M15.986 9.201 9.18 16.008l6.806 6.806 6.807-6.806z" />
              <path
                fill="#111928"
                d="M95.65 26.187c2.596 0 4.526-2.048 4.76-5.667.019-.293-.458-.464-.706-.305-.563.361-1.397.613-2.618.838-2.82.49-4.154 1.368-4.154 2.905 0 1.385 1.08 2.229 2.719 2.229m-1.671 3.715c-3.378 0-5.674-2.077-5.674-5.522 0-3.479 2.212-5.421 8.19-6.282 2.82-.456 3.715-1.014 3.715-2.28 0-1.486-1.283-2.33-3.63-2.33-2.628 0-5.07.715-7.009 2.16-.198.147-.49.01-.49-.236v-3.666c0-.085.037-.165.102-.219 1.899-1.565 4.912-2.363 7.6-2.363 5.37 0 8.122 2.483 8.122 7.245l.017 7.836c0 2.068.306 3.432 1.072 4.68.123.202-.016.47-.252.47h-3.606c-1.156 0-1.564-.996-1.571-4.141a.08.08 0 0 0-.079-.08.08.08 0 0 0-.075.053c-1.039 2.94-3.343 4.675-6.432 4.675M82.65 30.003c-3.732 0-5.793-2.145-5.793-6.097v-9.445a.434.434 0 0 0-.434-.434h-2.762a.434.434 0 0 1-.434-.435v-.799c0-.108.04-.212.113-.292l6.884-7.57a.43.43 0 0 1 .321-.142h.387c.24 0 .434.195.434.434v4.114c0 .24.195.434.435.434h4.13c.24 0 .434.194.434.434v3.387c0 .24-.194.435-.434.435H81.8a.434.434 0 0 0-.435.434v8.5c0 1.958.794 2.786 2.618 2.786.585 0 1.129-.097 1.632-.27.306-.103.648.11.648.432v2.928a.42.42 0 0 1-.223.374c-.994.514-2.12.792-3.391.792M67.184 29.393a.434.434 0 0 1-.434-.434V10.204c0-.24.195-.434.434-.434h3.759c.24 0 .434.194.434.434v18.755c0 .24-.194.434-.434.434zM59.147 29.394a.43.43 0 0 1-.336-.159l-9.316-11.364a.434.434 0 0 0-.77.275V28.96c0 .24-.195.434-.435.434h-3.86a.434.434 0 0 1-.434-.434V4.497c0-.24.195-.434.434-.434h3.86c.24 0 .435.194.435.434v10.078c0 .373.438.572.72.327l1.138-.992a.44.44 0 0 1 .285-.107h4.356c.405 0 .59.506.28.767l-1.548 1.303a.434.434 0 0 0-.052.614l10.342 12.192a.434.434 0 0 1-.332.715z"
              />
              <path
                fill="#111928"
                d="M61.66 4.05c.24 0 .436.196.43.436-.12 5.087-2.344 8.481-5.25 10.549-2.704 1.924-5.862 2.609-8.14 2.67a.423.423 0 0 1-.43-.43l.027-3.248a.45.45 0 0 1 .438-.442c1.59-.068 3.796-.58 5.618-1.876 1.819-1.294 3.402-3.464 3.515-7.223a.445.445 0 0 1 .441-.435zM72.436 2.73l-4.574 5.003a.434.434 0 0 1-.755-.293V2.437c0-.24.195-.435.435-.435h4.574c.377 0 .575.45.32.728"
              />
            </svg>
          </span>
          <span>
            <Button size="sm">Masuk</Button>
          </span>
        </header>
        <div className="font-bold font-manrope text-[24px] mb-5">Confirm your email address</div>
        <div className="text-[15px] mb-3">Hi,</div>
        <div className="text-[15px] mb-7.5">
          Please, confirm your email to finish setting up your Finex Kita account. The link expires
          in 24 hours.
        </div>
        <Button size="lg" className="mb-10 w-fit">
          Confirm email address
        </Button>
      </div>
      <footer className="bg-background-secondary flex justify-center py-6 w-full px-2">
        <div className="max-w-[520px]">
          <div className="text-content-secondary text-[12px] mb-6">
            This is an automated message. Please do not reply. If you need help, please contact us
            at <span className="text-base-link">education@finex.co.id.</span>
          </div>
          <div className="text-content-secondary text-[12px] mb-3">
            Transaksi Derivatif adalah Transaksi High Risk High Return.
          </div>
          <div className="text-content-secondary text-[12px] mb-3">
            Finex Kita is licensed and supervised by Bappebti, OJK, and BI, and is a member of JFX
            and KBI.
          </div>
          <div className="flex gap-6 mb-6">
            <a href="/" className="text-base-link text-[12px]">
              View in browser
            </a>
            <a href="/" className="text-base-link text-[12px]">
              Complete study
            </a>
          </div>
          <div className="text-content-secondary text-[12px] mb-2">
            © 2026 Finex Kita. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
