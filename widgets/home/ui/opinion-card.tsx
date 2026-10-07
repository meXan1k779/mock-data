'use client';

// Used to link out to a Google Form, but in the usability-test prototype
// there's no way back once the tester follows an external link — so the
// card stays purely decorative here instead of navigating away.

const PHOTOS = [
  {
    src: '/home-sidebar-v3/opinion-photo-2.png',
    className: 'left-[34px]',
  },
  {
    src: '/home-sidebar-v3/opinion-photo-1.png',
    className: 'left-[176px]',
  },
];

export const OpinionCard = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      {/* Mobile (<540px) and desktop sidebar (2md+): two photos, text bottom-left */}
      <div className="bg-background-secondary hover:bg-secondary-default transition-colors rounded-3xl relative overflow-hidden w-full h-[226px] 2md:h-[220px] flex min-[540px]:hidden 2md:flex">
        <img
          src="/home-sidebar-v3/opinion-pattern.svg"
          alt=""
          className="absolute left-[-2px] top-[-52px] w-[356px] h-[426px] pointer-events-none"
        />

        {PHOTOS.map((photo) => (
          <div
            key={photo.src}
            className={`absolute top-[19px] w-[71px] h-[72px] rounded-[25.7px] border-[3px] border-white shadow-[0px_7.342px_18.356px_-3.671px_rgba(0,0,0,0.12)] overflow-hidden ${photo.className}`}
          >
            <img src={photo.src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}

        <div className="absolute left-[22px] bottom-[22px] w-[278px] flex flex-col gap-1 text-content-primary">
          <p className="font-semibold text-lg leading-7">Pendapat Anda penting</p>
          <p className="text-base leading-6">
            Ceritakan apa yang sudah baik dan apa yang masih perlu diperbaiki
          </p>
        </div>
      </div>

      {/* Tablet (540px to <2md): one photo bleeding off the right edge, text top-left */}
      <div className="bg-background-secondary hover:bg-secondary-default transition-colors rounded-3xl relative overflow-hidden w-full h-[112px] hidden min-[540px]:block 2md:hidden">
        <img
          src="/home-sidebar-v3/opinion-pattern-tablet.svg"
          alt=""
          className="absolute right-[-74px] top-[-132px] w-[374px] h-[444px] pointer-events-none"
        />

        <div className="absolute -scale-x-100 right-[34px] top-[19px] w-[74px] h-[75px] rounded-[28px] border-[3px] border-white shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.12)] overflow-hidden">
          <img
            src="/home-sidebar-v3/opinion-photo-tablet.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute left-[14px] right-[115px] top-[14px] flex flex-col gap-1 text-content-primary">
          <p className="font-semibold text-lg leading-7">Pendapat Anda penting</p>
          <p className="text-base leading-6">
            Ceritakan apa yang sudah baik dan apa yang masih perlu diperbaiki
          </p>
        </div>
      </div>
    </div>
  );
};
