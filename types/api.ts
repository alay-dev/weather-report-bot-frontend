export type ApiSuccess<T = string> = {
  data: T;
  error: null;
  success: true;
  message: string;
};
