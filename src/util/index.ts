export const throwErrorResult = (message: string, statusCode = 400) => {
  const err = new Error(message);
  (err as any).statusCode = statusCode;
  throw err;
}