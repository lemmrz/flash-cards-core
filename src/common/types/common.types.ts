export type RequestWithUser = {
  user: {
    userId: number;
    email: string;
  } & Express.Request;
};
export type RequestWithUserAndBody<T> = {
  user: {
    userId: number;
    email: string;
  } & Express.Request;
} & { body: T };