/**
 * Determine the current login state based on the account and token.
 *
 * @param account The account object
 * @param token The account auth token
 * @returns The current login state
 */
export const getAuthState = (
  account: Account,
  token: LoginAuth["token"],
): AuthState => {
  if (!account?.account_id || !token) {
    return "LOGGED_OUT";
  }

  if (account.client_verification_required) {
    return "TWO_FACTOR";
  }

  return "LOGGED_IN";
};

/**
 * Based on the current login state, return the path to redirect to.
 *
 * @param loginState The current login state
 * @returns The path to redirect to
 */
export const getRedirectPath = (loginState: AuthState): string => {
  switch (loginState) {
    case "LOGGED_IN":
      return "/dashboard";
    case "TWO_FACTOR":
      return "/2fa";
    default:
      return "/login";
  }
};
