export function arrayToTopicString(arr: string[]) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return '';
  }
  return arr.map((item) => `&topic=${item}`).join('');
}
