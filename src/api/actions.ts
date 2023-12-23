"use server";

import { BASE_URL, ENDPOINT } from "./constants";

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
  const response = await fetch(`${BASE_URL}${ENDPOINT.login}`, {
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
