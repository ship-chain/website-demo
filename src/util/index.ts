export const throwErrorResult = (message: string, statusCode: number) => {
  const err = new Error(message);
  (err as any).statusCode = statusCode;
  throw err;
}