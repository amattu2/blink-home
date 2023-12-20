/**
 * @version v5
 */
type Account = {
  account_id: number;
  account_verification_required: boolean;
  amazon_account_linked: boolean;
  braze_external_id: string;
  client_id: number;
  client_trusted: boolean;
  client_verification_required: boolean;
  country_required: boolean;
  new_account: boolean;
  phone_verification_required: boolean;
  region: string;
  require_trust_client_device: boolean;
  tier: string;
  user: AccountUser;
  user_id: number;
  verification_channel: "phone" | "email";
};

type AccountUser = {
  user_id: number;
  country: string;
};

type AccountPhone = {
  country_calling_code: string;
  last_4_digits: string;
  /**
   * @example "+1******0000"
   */
  number: string;
  valid: boolean;
};
