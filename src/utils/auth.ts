/**
 * Based on the current login state, return the path to redirect to.
 *
 * @param loginState The current login state
 * @returns The path to redirect to
 */
export const getRedirectPath = (loginState: AuthState | undefined): string => {
  switch (loginState) {
    case "LOGGED_IN":
      return "/dashboard";
    case "TWO_FACTOR":
      return "/2fa";
    default:
      return "/login";
  }
};
