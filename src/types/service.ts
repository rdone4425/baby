export type LoadState = "idle" | "loading" | "success" | "empty" | "error";

export type ServiceResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};
