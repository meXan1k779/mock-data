const IMG_PLACEHOLDER_REGEX = /<img\s+alt=([^\s>]+)([^>]*)>/g;

export const injectImageUrls = (
  html: string,
  attachments: Array<{ fileId: string; id: string; link: string }>,
): string => {
  if (!attachments?.length) {
    return html;
  }

  const attachmentMap = new Map(attachments.map((a) => [a.fileId, a]));

  return html.replace(IMG_PLACEHOLDER_REGEX, (fullMatch, rawId, restAttributes) => {
    const cleanId = (rawId as string).replace(/["']/g, '');
    const attachment = attachmentMap.get(cleanId);
    if (attachment?.link) {
      return `<img alt="${cleanId}" src="${attachment.link}"${restAttributes} />`;
    }
    return fullMatch;
  });
};
