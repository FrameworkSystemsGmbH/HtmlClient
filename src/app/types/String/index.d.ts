interface StringConstructor {
  empty(): string;
  equals(x: string, y: string, ignoreCase: boolean): boolean;
  isNullOrWhiteSpace(str: string): boolean;
}

interface String {
  equals(other: string, ignoreCase: boolean): boolean;
}
