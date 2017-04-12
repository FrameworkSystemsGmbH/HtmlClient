interface StringConstructor {
  equals(x: string, y: string, ignoreCase: boolean): boolean;
}

interface String {
  equals(other: string, ignoreCase: boolean): boolean;
}
