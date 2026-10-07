import clsx from 'clsx';

// Used to link out to a Google Form, but in the usability-test prototype
// there's no way back once the tester follows an external link — so the
// banner stays purely decorative here instead of navigating away.
export const OpinionBanner = ({ className }: { className?: string }) => {
  return (
    <div className={clsx('block', className)}>
      <div className="bg-background-secondary rounded-3xl overflow-hidden relative flex w-full aspect-360/326 max-h-[326px] sm:max-h-none sm:aspect-auto sm:h-32 2md:aspect-auto 2md:h-[326px]">
        <div className="absolute top-[8.59%] bottom-0 left-[0.56%] right-[0.56%] sm:top-0 sm:bottom-0 sm:left-1/2 2md:top-7 2md:bottom-24 2md:left-0.5 bg-repeat bg-[url(/opinion-banner/pattern.png)] bg-size-[18.82%] sm:bg-size-[88px_88px] 2md:bg-size-[67px_67px] sm:[background-position-y:50%] pointer-events-none" />

        <div className="sm:hidden 2md:block absolute left-[9.44%] top-[8.28%] w-[18.61%] aspect-square 2md:aspect-auto 2md:left-[34px] 2md:top-[27px] 2md:w-[67px] 2md:h-[68px] rounded-[38.81%] 2md:rounded-[26px] border-[3px] border-white overflow-hidden shadow-[0px_7px_18px_-4px_rgba(0,0,0,0.12)]">
          <img alt="" className="w-full h-full object-cover" src="/opinion-banner/photo-3.jpg" />
        </div>

        <div className="sm:hidden 2md:block absolute left-[46.67%] top-[8.28%] w-[18.61%] aspect-square 2md:aspect-auto 2md:left-[168px] 2md:top-[27px] 2md:w-[67px] 2md:h-[68px] rounded-[38.81%] 2md:rounded-[26px] border-[3px] border-white overflow-hidden shadow-[0px_7px_18px_-4px_rgba(0,0,0,0.12)]">
          <img alt="" className="w-full h-full object-cover" src="/opinion-banner/photo-1.jpg" />
        </div>

        <div className="absolute left-[28.61%] top-[29.14%] w-[18.61%] aspect-square sm:aspect-auto 2md:aspect-auto rounded-[38.81%] sm:left-auto sm:right-[10%] sm:top-5 sm:h-[88px] sm:w-[89px] sm:rounded-[26px] 2md:left-[103px] 2md:top-[95px] 2md:w-[67px] 2md:h-[68px] 2md:rounded-[26px] border-[3px] border-white overflow-hidden shadow-[0px_7px_18px_-4px_rgba(0,0,0,0.12)]">
          <img alt="" className="w-full h-full object-cover" src="/opinion-banner/photo-2.jpg" />
        </div>

        <div className="sm:hidden 2md:block absolute left-[65.28%] top-[29.14%] w-[18.61%] aspect-square 2md:aspect-auto 2md:left-[235px] 2md:top-[95px] 2md:w-[67px] 2md:h-[68px] rounded-[38.81%] 2md:rounded-[26px] border-[3px] border-white overflow-hidden shadow-[0px_7px_18px_-4px_rgba(0,0,0,0.12)] scale-x-[-1]">
          <img alt="" className="w-full h-full object-cover" src="/opinion-banner/photo-4.jpg" />
        </div>

        <div className="absolute bottom-[4.91%] left-4 md:left-6 2md:left-8 items-end right-4 sm:top-0 sm:bottom-0 sm:right-1/2 sm:items-center 2md:top-auto 2md:bottom-[30px] 2md:right-[25px] 2md:items-end flex gap-4">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="font-semibold text-lg leading-7 text-content-primary">
              Pendapat Anda penting
            </p>
            <p className="text-base leading-6 text-content-primary">
              Ceritakan apa yang sudah baik dan apa yang masih perlu diperbaiki.
            </p>
          </div>
          <div className="shrink-0 bg-white rounded-full w-10 h-10 items-center justify-center shadow-[0px_2px_6px_rgba(17,25,40,0.12)] flex sm:hidden 2md:flex">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M9 18l6-6-6-6"
                stroke="#111928"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
