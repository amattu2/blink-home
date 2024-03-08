export const BASE_URL = "https://rest-{{tier}}.immedia-semi.com/";

export const ENDPOINT = {
  login: "api/v5/account/login",
  register: "api/v6/account/register",
  verifyLoginPin:
    "api/v4/account/{{account_id}}/client/{{client_id}}/pin/verify",
  resendLoginPin:
    "api/v4/account/{{account_id}}/client/{{client_id}}/pin/resend",
  logout: "api/v4/account/{{account_id}}/client/{{client_id}}/logout",
  homescreen: "api/v4/accounts/{{account_id}}/homescreen",
  countries: "api/v1/countries",
  media_changed: "api/v2/accounts/{{account_id}}/media/changed",
  refresh_lotus_thumbnail:
    "api/v1/accounts/{{account_id}}/networks/{{network_id}}/doorbells/{{device_id}}/thumbnail",
  refresh_owl_thumbnail:
    "api/v1/accounts/{{account_id}}/networks/{{network_id}}/owls/{{device_id}}/thumbnail",
  refresh_superior_thumbnail:
    "api/v1/accounts/{{account_id}}/networks/{{network_id}}/superiors/{{device_id}}/thumbnail",
};
