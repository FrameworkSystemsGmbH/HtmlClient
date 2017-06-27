interface StringConstructor {
  empty(): string;
  equals(x: string, y: string, ignoreCase: boolean): boolean;
}

interface String {
  equals(other: string, ignoreCase: boolean): boolean;
}
