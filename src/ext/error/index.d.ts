interface ErrorConstructor {

  ensureError: (input: unknown) => Error;

  stringify: (error: Error) => string;

}
