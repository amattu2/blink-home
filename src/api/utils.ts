import { IronSession, getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { ENDPOINT } from "./constants";

/**
 * Formats a template url with the account information
 *
 * @param url The url to format
 * @param extras The account information
 * @returns formatted url
 */
export const formatUrl = (
  base: string,
  path: string,
  extras?: Record<string, string | number | boolean>,
): string => {
  const { account_id, client_id, tier } = extras || {};

  let url = `${base}${path}`
    .replace("{{tier}}", tier?.toString() || "prod")
    .replace("{{account_id}}", account_id?.toString() || "")
    .replace("{{client_id}}", client_id?.toString() || "");

  Object.keys(extras || {}).forEach((key) => {
    if (url.includes(`{{${key}}}`) && extras?.[key] !== undefined) {
      url = url.replace(`{{${key}}}`, extras[key].toString());
    }
  });

  return url;
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

/**
 * Maps the device type to the refresh thumbnail url
 *
 * @param device_type The device type
 * @returns The refresh thumbnail url
 * @throws If the device type is not supported
 */
export const getRefreshThumbnailUrl = (
  device_type: VisionDeviceType,
): string => {
  switch (device_type) {
    case "lotus":
      return ENDPOINT.refresh_lotus_thumbnail;
    case "owl":
    case "superior":
      return ENDPOINT.refresh_owl_thumbnail;
    default:
      throw new Error(`Device type ${device_type} not supported`);
  }
};

/**
 * Maps the device type to the view thumbnail url
 *
 * @param device_type The device type
 * @returns The view thumbnail url
 */
export const getViewThumbnailUrl = (device_type: VisionDeviceType): string => {
  switch (device_type) {
    case "lotus":
      return ENDPOINT.lotus_thumbnail;
    case "owl":
      return ENDPOINT.owl_thumbnail;
    case "superior":
      return ENDPOINT.superior_thumbnail;
    default:
      throw new Error(`Device type ${device_type} not supported`);
  }
};
