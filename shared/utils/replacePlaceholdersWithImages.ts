import { fetchImageAsDataURL } from './fetchImgAsDataUrl';

export const replacePlaceholdersWithImages = async (
  html: string,
  attachments: Array<{ fileId: string; id: string; link: string }>,
): Promise<string> => {
  if (!attachments || attachments.length === 0) {
    return html;
  }

  const attachmentMap = new Map(attachments.map((a) => [a.fileId, a]));

  const imgTagRegex = /<img\s+alt=([^\s>]+)([^>]*)>/g;

  const uniqueIds = new Set<string>();
  let match;
  while ((match = imgTagRegex.exec(html)) !== null) {
    const rawId = match[1];
    const cleanId = rawId.replace(/["']/g, '');
    uniqueIds.add(cleanId);
  }

  const loadPromises: Promise<{ id: string; dataUrl: string | null }>[] = [];

  for (const id of uniqueIds) {
    const attachment = attachmentMap.get(id);
    if (attachment) {
      loadPromises.push(
        fetchImageAsDataURL(attachment?.link)
          .then((dataUrl: string) => ({ id, dataUrl }))
          .catch(() => ({ id, dataUrl: null })),
      );
    } else {
      loadPromises.push(Promise.resolve({ id, dataUrl: null }));
    }
  }

  const results = await Promise.all(loadPromises);
  const dataUrlMap = new Map(results.map((r) => [r.id, r.dataUrl]));

  const resultHtml = html.replace(imgTagRegex, (fullMatch, rawId, restAttributes) => {
    const cleanId = rawId.replace(/["']/g, '');
    const dataUrl = dataUrlMap.get(cleanId);

    if (dataUrl) {
      return `<img alt="${cleanId}" src="${dataUrl}"${restAttributes} />`;
    } else {
      return fullMatch;
    }
  });

  // // Удаляем attachments, которых нет в HTML ( пока что оставим )
  // const idsToDelete = attachments.map((a) => a.id).filter((id) => !uniqueIds.has(id));

  // if (idsToDelete.length > 0) {
  //   try {
  //     // await Promise.all(idsToDelete.map((id) => deleteAttachment?.(id)));
  //   } catch (error) {
  //     console.error('Failed to delete attachments:', error);
  //     notFound();
  //   }
  // }

  return resultHtml;
};
