// Static cover from Figma's "Video page for test prototype" placeholder —
// the same generic image regardless of which video this stands in for.
const PLACEHOLDER_COVER_URL = '/trading-videos/video-placeholder-cover.jpg';

export const VideoPlaceholder = () => (
  <div className="relative aspect-video w-full overflow-hidden">
    <img src={PLACEHOLDER_COVER_URL} alt="" className="absolute inset-0 size-full object-cover" />
    <div className="absolute inset-0 mix-blend-multiply bg-gradient-to-b from-black/0 to-black/50" />
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <p className="text-center text-[20px] leading-7 font-semibold text-white">
        Pada prototipe pengujian ini, video tidak ditampilkan
      </p>
    </div>
  </div>
);
