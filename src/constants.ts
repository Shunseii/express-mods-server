export const COOKIE_NAME = "qid";
export const IS_PROD = process.env.NODE_ENV === "production";
export const PORT = 4000;
export const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 365 * 7; // 7 years
export const COOKIE_SECRET = "apple";
