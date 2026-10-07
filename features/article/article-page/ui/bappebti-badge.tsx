export const BappebtiBadge = ({
  aprovalNumber,
  label = 'Article approved by Bappebti',
}: {
  aprovalNumber: string;
  label?: string;
}) => (
  <div className="flex items-center gap-2 mb-4">
    <img src="/icons/bapetti.svg" alt="bapetti" className="shrink-0" />
    <div className="flex flex-col gap-1">
      <div className="text-sm leading-4 font-semibold text-content-primary">{label}</div>
      <div className="text-[12px] leading-4 text-content-secondary">{aprovalNumber}</div>
    </div>
  </div>
);
