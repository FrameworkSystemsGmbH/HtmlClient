interface StringConstructor {

  empty: () => string;

  equals: (x: string, y: string, ignoreCase: boolean) => boolean;

  replaceAll: (str: string, search: string, replacement: string) => string;

  trimCharsLeft: (str: string, chars: string) => string;

  trimCharsRight: (str: string, chars: string) => string;

  trimChars: (str: string, chars: string) => string;

  trimStringLeft: (str: string, trimStr: string) => string;

  trimStringRight: (str: string, trimStr: string) => string;

  trimString: (str: string, trimStr: string) => string;

}

interface String {

  equals: (other: string, ignoreCase: boolean) => boolean;

  trimCharsLeft: (chars: string) => string;

  trimCharsRight: (chars: string) => string;

  trimChars: (chars: string) => string;

  trimStringLeft: (trimStr: string) => string;

  trimStringRight: (trimStr: string) => string;

  trimString: (trimStr: string) => string;

}
