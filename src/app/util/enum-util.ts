export function getNumberEnumFromString(enumType: Record<string, unknown>, key: string): number | null {
  const entry = Object.entries(enumType).find(e => e[0] === key);

  if (entry != null && typeof entry[1] === 'number') {
    return entry[1];
  }

  return null;
}

export function getStringEnumFromString(enumType: Record<string, unknown>, key: string): string | null {
  const entry = Object.entries(enumType).find(e => e[0] === key);

  if (entry != null && typeof entry[1] === 'string') {
    return entry[1];
  }

  return null;
}
