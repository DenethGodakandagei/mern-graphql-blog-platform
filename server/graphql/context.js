import { auth } from "../utils/auth.js";

export const context = async ({ req }) => {
  const user = await auth({ req });
  return { user };
};
