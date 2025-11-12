export const getParsedError = (error: string): ErrorObject => {
  try {
    const parsedError = JSON.parse(error);
    if (parsedError && typeof parsedError === 'object') {
      return parsedError as ErrorObject;
    }
    return { message: parsedError };
  } catch {
    return { message: error };
  }
};

interface ErrorObject {
  message?: string;
  status?: number;
  error?: string;
}
