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
