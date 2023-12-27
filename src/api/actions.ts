"use server";

import { BASE_URL, ENDPOINT } from "./constants";
import { buildIronSession, formatUrl } from "./utils";

/**
 * Perform a login request
 *
 * @param email
 * @param password
 * @param extras
 * @returns {Promise<LoginApiResponse>}
 */
export const login = async (
  email: string,
  password: string,
  extras: Omit<
    LoginBody,
    "email" | "password" | "unique_Id" | "client_name" | "reauth"
  >,
): Promise<ApiSuccess<LoginApiResponse> | ApiError<LoginApiResponse>> => {
  const session = await buildIronSession();
  if (session.state !== "LOGGED_OUT") {
    return {
      status: "error",
      message: "Already logged in",
      two_factor_auth: session.state === "TWO_FACTOR",
    };
  }

  const url = formatUrl(BASE_URL, ENDPOINT.login);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      ...extras,
      unique_Id: session.client_id,
      client_name: process.env.CLIENT_NAME,
      reauth: session.reauth,
    }),
  }).catch(() => null);

  const json = await response?.json()?.catch(() => null);

  if (!response || !response.ok || !json || !json?.account?.account_id) {
    return {
      status: "error",
      message: json?.message ?? "Unknown error",
      two_factor_auth: false,
    };
  }

  session.state = json?.account?.client_verification_required
    ? "TWO_FACTOR"
    : "LOGGED_IN";
  session.account = json?.account;
  session.reauth = true;
  session.token = json?.auth?.token;
  await session.save();

  return {
    status: "ok",
    two_factor_auth: json?.account?.client_verification_required,
  };
};

/**
 * Verify a login request using a pin (2fa)
 *
 * @param pin The pin to verify
 * @returns {Promise<TwoFactorApiResponse>}
 */
export const verifyLoginPin = async (
  pin: number,
): Promise<
  ApiSuccess<TwoFactorApiResponse> | ApiError<TwoFactorApiResponse>
> => {
  const session = await buildIronSession();
  if (session.state !== "TWO_FACTOR" || !session.account || !session.token) {
    return {
      status: "error",
      message: `Incorrect login state: ${session.state}`,
    };
  }

  const url = formatUrl(BASE_URL, ENDPOINT.verifyLoginPin, session.account);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "TOKEN-AUTH": session.token,
    },
    body: JSON.stringify({ pin }),
  }).catch(() => null);

  const json = await response?.json()?.catch(() => null);

  if (!response || !response.ok || !json) {
    return {
      status: "error",
      message: json?.message ?? "Unknown error",
    };
  }

  session.state = "LOGGED_IN";
  await session.save();

  return {
    status: "ok",
  };
};

/**
 * Resend the 2FA login pin
 *
 * @returns {Promise<TwoFactorApiResponse>}
 */
export const resendLoginPin = async (): Promise<
  ApiSuccess<TwoFactorApiResponse> | ApiError<TwoFactorApiResponse>
> => {
  const session = await buildIronSession();
  if (session.state !== "TWO_FACTOR" || !session.account || !session.token) {
    return {
      status: "error",
      message: `Incorrect login state: ${session.state}`,
    };
  }

  const url = formatUrl(BASE_URL, ENDPOINT.resendLoginPin, session.account);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "TOKEN-AUTH": session.token,
    },
  }).catch(() => null);

  const json = await response?.json()?.catch(() => null);

  if (!response || !response.ok || !json || !json?.valid) {
    return {
      status: "error",
      message: json?.message ?? "Unknown error",
    };
  }

  return {
    status: "ok",
  };
};

/**
 * Perform an API logout request
 *
 * @returns {Promise<LogoutApiResponse>}
 */
export const logout = async (): Promise<
  ApiSuccess<LogoutApiResponse> | ApiError<LogoutApiResponse>
> => {
  const session = await buildIronSession();
  if (session.state !== "TWO_FACTOR" || !session.account || !session.token) {
    const oldId = session.client_id;
    await session.destroy();
    session.client_id = oldId;
    session.state = "LOGGED_OUT";
    await session.save();

    return {
      status: "ok",
    };
  }

  const url = formatUrl(BASE_URL, ENDPOINT.logout, session.account);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "TOKEN-AUTH": session.token,
    },
  }).catch(() => null);

  const json = await response?.json()?.catch(() => null);

  if (!response || !response.ok || json?.message !== "logout") {
    return {
      status: "error",
      message: json?.message ?? "Unknown error",
    };
  }

  const oldId = session.client_id;
  await session.destroy();
  session.client_id = oldId;
  session.state = "LOGGED_OUT";
  await session.save();

  return {
    status: "ok",
  };
};

/**
 * Get the account information for the current session
 *
 * @returns {Promise<GetAccountApiResponse>}
 */
export const getAccount = async (): Promise<
  ApiSuccess<GetAccountApiResponse> | ApiError<GetAccountApiResponse>
> => {
  const session = await buildIronSession();
  if (session.state !== "LOGGED_IN" || !session.account) {
    return {
      status: "error",
      message: `Incorrect login state: ${session.state}`,
      account: null,
      state: session.state,
    };
  }

  return {
    status: "ok",
    account: session.account,
    state: session.state,
  };
};

export const getHomeScreen = async (): Promise<
  ApiSuccess<GetHomeScreenApiResponse> | ApiError<GetHomeScreenApiResponse>
> => {
  const session = await buildIronSession();
  if (session.state !== "LOGGED_IN" || !session.account || !session.token) {
    return {
      status: "error",
      message: `Incorrect login state: ${session.state}`,
      data: null,
    };
  }

  const url = formatUrl(BASE_URL, ENDPOINT.homescreen, session.account);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "TOKEN-AUTH": session.token,
    },
  }).catch(() => null);

  const json = await response?.json()?.catch(() => null);

  if (!response || !response.ok || !json) {
    return {
      status: "error",
      message: json?.message ?? "Unknown error",
      data: null,
    };
  }

  return {
    status: "ok",
    data: json,
  };
};
