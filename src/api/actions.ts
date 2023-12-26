"use server";

import { BASE_URL, ENDPOINT } from "./constants";
import { formatUrl } from "./utils";

export const config = {
  runtime: "experimental-edge",
};

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

/**
 * Verify a login request using a pin (2fa)
 *
 * @param pin The pin to verify
 * @param account The account to verify the pin for
 * @param token The API token to use
 * @returns {Promise<VerifyLoginResponse>}
 */
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

/**
 * Resend the 2FA login pin
 *
 * @param account Current account
 * @param token API token
 * @returns {Promise<VerifyLoginResponse>}
 */
export const resendLoginPin = async (
  account: Account,
  token: LoginAuth["token"],
): Promise<ApiSuccess<VerifyLoginResponse> | ApiError<VerifyLoginResponse>> => {
  const url = formatUrl(BASE_URL, ENDPOINT.resendLoginPin, account);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "TOKEN-AUTH": token,
    },
  }).catch(() => null);

  const json = await response?.json()?.catch(() => null);

  if (!response || !response.ok || !json || !json?.valid) {
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

/**
 * Perform an API logout request
 *
 * @param account The current account
 * @param token The session API token
 * @returns {Promise<LogoutResponse>}
 */
export const logout = async (
  account: Account,
  token: LoginAuth["token"],
): Promise<ApiSuccess<LogoutResponse> | ApiError<LogoutResponse>> => {
  const url = formatUrl(BASE_URL, ENDPOINT.logout, account);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "TOKEN-AUTH": token,
    },
  }).catch(() => null);

  const json = await response?.json()?.catch(() => null);

  if (!response || !response.ok || json?.message !== "logout") {
    return {
      status: "error",
      message: json?.message ?? "Unknown error",
      data: json,
    };
  }

  return {
    status: "ok",
    data: json as LogoutResponse,
  };
};
