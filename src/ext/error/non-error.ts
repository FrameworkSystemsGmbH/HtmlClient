import inspect from 'object-inspect';

export class NonError extends Error {
  public constructor(input: unknown) {
    super(inspect(input));

    this.name = 'Non-Error';
    this.stack = `${this.name}: ${this.message}\n${this.captureStackTrace()}`;
  }

  private captureStackTrace(): string {
    const stack: string | undefined = new Error().stack;

    if (stack == null) {
      return '<stack missing>';
    }

    const stackLines: Array<string> = stack.split('\n');

    if (stackLines.length <= 4) {
      return '<stack missing>';
    }

    stackLines.splice(0, 4);

    return stackLines.join('\n');
  }
}
