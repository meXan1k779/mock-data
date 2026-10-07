import { ColumnsIcon } from '@/shared/icons/columnsIcon';
import { CupIcon } from '@/shared/icons/cupIcon';
import { MoratarBoardIcon } from '@/shared/icons/mortarBoardIcon';

export const LevelBadge = ({ level }: { level: number }) => {
  const getLevelData = (level: number) => {
    switch (level) {
      case 1:
        return {
          title: 'Untuk pemula',
          icon: <MoratarBoardIcon />,
          color: 'bg-green',
          textColor: 'text-green-100',
        };
      case 2:
        return {
          title: 'Untuk trader tingkat lanjut',
          icon: <ColumnsIcon />,
          color: 'bg-orange',
          textColor: 'text-orange-100',
        };
      case 3:
        return {
          title: 'Untuk ahli',
          icon: <CupIcon />,
          color: 'bg-blue',
          textColor: 'text-blue-100',
        };
      default:
        return {
          title: '',
          icon: null,
        };
    }
  };

  const { icon, title, color, textColor } = getLevelData(level);

  return (
    <div className={`text-xs px-2 py-1 rounded-sm inline-flex ${color} ${textColor}`}>
      <span className="mr-1">{icon}</span>
      {title}
    </div>
  );
};
