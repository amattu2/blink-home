import { IronSession, getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

/**
 * Formats a template url with the account information
 *
 * @param url The url to format
 * @param account The account information
 * @returns formatted url
 */
export const formatUrl = (
  base: string,
  path: string,
  account?: Account,
): string => {
  const { account_id, client_id } = account || {};

  return `${base}${path}`
    .replace("{{tier}}", account?.tier || "prod")
    .replace("{{account_id}}", account_id?.toString() || "")
    .replace("{{client_id}}", client_id?.toString() || "");
};

/**
 * Initializes an iron session
 *
 * @returns The iron session for the app
 */
export const buildIronSession = async (): Promise<IronSession<AuthSession>> => {
  if (!process.env.SESSION_PASSWORD) {
    throw new Error("Missing SESSION_PASSWORD environment variable");
  }
  if (!process.env.SESSION_COOKIE_NAME) {
    throw new Error("Missing SESSION_COOKIE_NAME environment variable");
  }

  const session = await getIronSession<AuthSession>(cookies(), {
    password: process.env.SESSION_PASSWORD,
    cookieName: process.env.SESSION_COOKIE_NAME,
  });

  if (!session.state) {
    session.state = "LOGGED_OUT";
  }
  if (!session.client_id) {
    session.client_id = uuidv4();
    session.reauth = false;
  }

  await session.save();
  return session;
};
