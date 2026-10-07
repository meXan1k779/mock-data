interface MenuItemsProps {
  isOwn: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
}

export function MenuItems({ isOwn, onEdit, onDelete, onReport }: MenuItemsProps) {
  return (
    <div className="flex flex-col min-w-[160px]">
      {isOwn ? (
        <>
          <button
            onClick={onEdit}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-content-primary hover:bg-background-secondary transition-colors cursor-pointer"
          >
            Ubah komentar
          </button>
          <button
            onClick={onDelete}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-40 hover:bg-background-secondary transition-colors cursor-pointer"
          >
            Hapus
          </button>
        </>
      ) : (
        <button
          onClick={onReport}
          className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-content-primary hover:bg-background-secondary transition-colors cursor-pointer"
        >
          Laporkan komentar
        </button>
      )}
    </div>
  );
}
