import { NonError } from './non-error';

Error.ensureError = function (input: unknown): Error {
  if (!(input instanceof Error)) {
    return new NonError(input);
  }

  const error: Error = input;

  if (error.name.trim().length === 0) {
    error.name = error.constructor.name || 'Error';
  }

  if (error.message.trim().length === 0) {
    error.message = '<no error message provided>';
  }

  if (error.stack == null || error.stack.trim().length === 0) {
    error.stack = '<original stack missing>';
  }

  return error;
};

Error.stringify = function (error: Error): string {
  const errorObj: object = {
    message: error.message,
    name: error.name,
    stack: error.stack ?? null
  };

  return JSON.stringify(errorObj);
};
