export interface ServerActionResponse<T = unknown> {
  success: boolean;
  response?: T;
  statusCode?: number;
  errorHeader?: string;
  errorMessage?: string;
}
