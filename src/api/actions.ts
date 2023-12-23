"use server";

import { BASE_URL, ENDPOINT } from "./constants";
import { formatUrl } from "./utils";

/**
 * Perform a login request
 *
 * @param email
 * @param password
 * @param extras
 * @returns {Promise<LoginResponse>}
 */
export const login = async (
  email: string,
  password: string,
  extras?: Omit<LoginBody, "email" | "password">,
): Promise<ApiSuccess<LoginResponse> | ApiError<LoginResponse>> => {
  const url = formatUrl(BASE_URL, ENDPOINT.login);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, ...extras }),
  }).catch(() => null);

  const json = await response?.json()?.catch(() => null);

  if (!response || !response.ok || !json) {
    return {
      status: "error",
      message: json?.message ?? "Unknown error",
      data: json,
    };
  }

  return {
    status: "ok",
    data: json as LoginResponse,
  };
};

export const verifyLoginPin = async (
  pin: number,
  account: Account,
  token: LoginAuth["token"],
): Promise<ApiSuccess<VerifyLoginResponse> | ApiError<VerifyLoginResponse>> => {
  const url = formatUrl(BASE_URL, ENDPOINT.verifyLoginPin, account);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "TOKEN-AUTH": token,
    },
    body: JSON.stringify({ pin }),
  }).catch(() => null);

  const json = await response?.json()?.catch(() => null);

  if (!response || !response.ok || !json) {
    return {
      status: "error",
      message: json?.message ?? "Unknown error",
      data: json,
    };
  }

  return {
    status: "ok",
    data: json as VerifyLoginResponse,
  };
};
