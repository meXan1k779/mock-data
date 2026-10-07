export const ARTICLE_EDITOR_LABELS = {
  // Статусы сохранения
  saving: 'Menyimpan...',
  savedToDraft: 'Disimpan di Draf',

  // Кнопки и действия
  preview: 'Pratinjau',
  publish: 'Publikasikan',

  // Плейсхолдеры
  titlePlaceholder: 'Tulis judul yang jelas',
} as const;

export type ArticleEditorLabel = keyof typeof ARTICLE_EDITOR_LABELS;
