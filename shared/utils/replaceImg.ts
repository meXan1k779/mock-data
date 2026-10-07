export function replaceAllImgTagsWithOne(htmlString: string) {
  const parts = htmlString.split(/(<img[^>]*>)/);
  const idByIndex = new Map<number, string>();

  for (let i = 1; i < parts.length; i += 2) {
    const tag = parts[i];
    const altMatch = tag.match(/alt=["']([^"']*)["']/);
    const alt = altMatch ? altMatch[1] : '';

    idByIndex.set(i, `<img alt="${alt}">`);
  }

  const newParts = [...parts];

  for (const [index, newTag] of idByIndex) {
    newParts[index] = newTag;
  }

  return newParts.join('');
}
