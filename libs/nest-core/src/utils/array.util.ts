export function joinNotEmptyNorWhitespace(
  items: Array<string | undefined>,
  separator: string
): string {
  return items.filter((x) => x?.trim()).join(separator);
}

export const splitArrayIntoChunks = <T>(
  array: T[],
  chunkSize: number
): T[][] => {
  const chunks: T[][] = [];
  let i = 0;
  while (i < array.length) {
    chunks.push(array.slice(i, i + chunkSize));
    i += chunkSize;
  }
  return chunks;
};

export const twoDArrayToOneDArray = <T>(array: T[][]): T[] => {
  return array.reduce((acc, curr) => acc.concat(curr), []);
};
