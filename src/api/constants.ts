export const BASE_URL = "https://rest-{{tier}}.immedia-semi.com/";

export const ENDPOINT = {
  login: "api/v5/account/login",
  verifyLoginPin:
    "api/v4/account/{{account_id}}/client/{{client_id}}/pin/verify",
  resendLoginPin:
    "api/v4/account/{{account_id}}/client/{{client_id}}/pin/resend",
};
