import { nanoid } from "nanoid";

export const generateSlug = (): string => {
  return nanoid(8);
};
