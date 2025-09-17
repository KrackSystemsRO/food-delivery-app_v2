import { error, log as logger } from "console";

export const log = (item: unknown, isError?: boolean) => {
  if (process.env.APP_ENV !== "production") {
    if (isError) {
      error(item);
      return;
    }
    logger(item);
  }
};
