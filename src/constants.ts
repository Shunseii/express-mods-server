export const COOKIE_NAME = "qid";
export const IS_PROD = process.env.NODE_ENV === "production";
export const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 365 * 7; // 7 years
export const FORGOT_PASSWORD_PREFIX = "forgot-password:";
