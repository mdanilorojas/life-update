// /lib/constants.ts
export const CURRENT_USER_ID = "danilo-main-user";

export function getAppPassword(): string {
  const password = process.env.APP_PASSWORD;
  if (!password) {
    throw new Error("APP_PASSWORD environment variable is required");
  }
  return password;
}
