"use server";

import { BASE_URL, ENDPOINT } from "./constants";
import { buildIronSession, formatUrl, getRefreshThumbnailUrl } from "./utils";

export const runtime = "edge";

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
    LoginApiBody,
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

  const url = formatUrl(BASE_URL, ENDPOINT.verifyLoginPin, {
    client_id: session.account.client_id,
    account_id: session.account.account_id,
    tier: session?.account?.tier,
  });
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

  const url = formatUrl(BASE_URL, ENDPOINT.resendLoginPin, {
    client_id: session.account.client_id,
    account_id: session.account.account_id,
    tier: session?.account?.tier,
  });
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
    session.destroy();
    session.client_id = oldId;
    session.state = "LOGGED_OUT";
    await session.save();

    return {
      status: "ok",
    };
  }

  const url = formatUrl(BASE_URL, ENDPOINT.logout, {
    client_id: session.account.client_id,
    account_id: session.account.account_id,
    tier: session?.account?.tier,
  });
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
  session.destroy();
  session.client_id = oldId;
  session.state = "LOGGED_OUT";
  session.reauth = false;
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
  if (session.state === "LOGGED_OUT" || !session.account) {
    return {
      status: "error",
      message: `Incorrect login state: ${session.state}`,
      account: null,
      state: session.state,
    };
  }

  // TODO: This function needs to fetch the account information from the API
  // and try to reauthenticate if the token is invalid

  return {
    status: "ok",
    account: session.account,
    state: session.state,
  };
};

/**
 * Get the Homescreen details for the current session
 *
 * @see Homescreen
 * @returns {Promise<GetHomeScreenApiResponse>}
 */
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

  const url = formatUrl(BASE_URL, ENDPOINT.homescreen, {
    account_id: session.account.account_id,
    tier: session?.account?.tier,
  });
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

/**
 * Gets the list of supported countries for registration
 *
 * @returns {Promise<GetCountriesApiResponse>}
 */
export const getCountries = async (): Promise<
  ApiSuccess<GetCountriesApiResponse> | ApiError<GetCountriesApiResponse>
> => {
  const url = formatUrl(BASE_URL, ENDPOINT.countries);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch(() => null);

  const json = await response?.json()?.catch(() => null);

  if (!response || !response.ok || !json?.countries?.length) {
    return {
      status: "error",
      message: json?.message ?? "Unknown error",
      countries: [],
    };
  }

  return {
    status: "ok",
    countries: json?.countries,
  };
};

export const register = async (
  email: string,
  password: string,
  password_confirm: string,
  country: string,
  extras: Pick<
    RegisterApiBody,
    "client_type" | "device_identifier" | "os_version"
  >,
): Promise<ApiSuccess<RegisterApiResponse> | ApiError<RegisterApiResponse>> => {
  const session = await buildIronSession();
  if (session.state !== "LOGGED_OUT") {
    return {
      status: "error",
      message: "Already logged in",
      two_factor_auth: session.state === "TWO_FACTOR",
    };
  }

  const url = formatUrl(BASE_URL, ENDPOINT.register);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      password_confirm,
      country,
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
 * Downloads the thumbnail image from the given url and returns it as a base64 string
 *
 * @param url The url to download the image from
 * @returns {Promise<string | null>}
 */
export const getThumbnailImage = async (
  url: string,
): Promise<string | null> => {
  const session = await buildIronSession();
  if (session.state !== "LOGGED_IN" || !session.account || !session.token) {
    return null;
  }

  const apiUrl = formatUrl(BASE_URL, url, { tier: session?.account?.tier });
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "TOKEN-AUTH": session.token,
      "Content-Type": "image/jpeg",
    },
  }).catch(() => null);

  const buffer = await response?.arrayBuffer()?.catch(() => null);
  if (!response || !response.ok || !buffer) {
    return null;
  }

  const base64 = Buffer.from(buffer).toString("base64");
  if (!base64) {
    return null;
  }

  return `data:image/jpeg;base64,${base64}`;
};

/**
 * Initiates the command to refresh the device thumbnail image
 *
 * @param network_id The network that the device is on
 * @param device_id The device to update
 * @param device_type The type of device to update
 * @returns Proimse<CommandApiResponse>
 */
export const updateThumbnailImage = async (
  network_id: number,
  device_id: number,
  device_type: VisionDeviceType,
): Promise<ApiSuccess<CommandApiResponse> | ApiError<CommandApiResponse>> => {
  const session = await buildIronSession();
  if (session.state !== "LOGGED_IN" || !session.account || !session.token) {
    return {
      status: "error",
      message: `Incorrect login state: ${session.state}`,
    };
  }

  const url = formatUrl(BASE_URL, getRefreshThumbnailUrl(device_type), {
    account_id: session.account.account_id,
    tier: session?.account?.tier,
    network_id,
    device_id,
  });
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "TOKEN-AUTH": session.token,
      "Content-Type": "application/json",
    },
  }).catch(() => null);

  const json = await response?.json()?.catch(() => null);
  if (!json?.id || json?.state !== "new") {
    return {
      status: "error",
      message: json?.message ?? "Unknown error",
    };
  }

  return {
    status: "ok",
    ...(json as CommandApiResponse),
  };
};

/**
 * Downloads the media mp4 video from the given url and returns it as a base64 string
 *
 * @todo This is a temporary solution until we can return an ArrayBuffer from a Server action
 * @param url The partial url to the video file
 * @returns {Promise<string | null>}
 */
export const getMediaVideo = async (url: string): Promise<string | null> => {
  const session = await buildIronSession();
  if (session.state !== "LOGGED_IN" || !session.account || !session.token) {
    return null;
  }

  const apiUrl = formatUrl(BASE_URL, url, { tier: session?.account?.tier });
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "TOKEN-AUTH": session.token,
      "Content-Type": "video/mp4",
    },
  }).catch(() => null);

  const buffer = await response?.arrayBuffer()?.catch(() => null);
  if (!response || !response.ok || !buffer) {
    return null;
  }

  const base64 = Buffer.from(buffer).toString("base64");
  if (!base64) {
    return null;
  }

  return `data:video/mp4;base64,${base64}`;
};

/**
 * Gets the list of media events across all networks since the given date
 *
 * @param since YYYY-MM-DD
 * @param page The page number to fetch
 * @returns {Promise<GetMediaApiResponse>}
 */
export const getChangedMedia = async (
  since: string,
  page: number,
): Promise<ApiSuccess<GetMediaApiResponse> | ApiError<GetMediaApiResponse>> => {
  const session = await buildIronSession();
  if (session.state !== "LOGGED_IN" || !session.account || !session.token) {
    return {
      status: "error",
      message: `Incorrect login state: ${session.state}`,
      media: [],
    };
  }

  const url = formatUrl(BASE_URL, ENDPOINT.media_changed, {
    account_id: session.account.account_id,
    tier: session.account.tier,
  });
  const params = new URLSearchParams({
    since,
    page: page.toString(),
  });

  const response = await fetch(`${url}?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "TOKEN-AUTH": session.token,
    },
  }).catch(() => null);

  const json = await response?.json()?.catch(() => null);

  if (!response || !response.ok || !json?.media?.length) {
    return {
      status: "error",
      message: json?.message ?? "Unknown error",
      media: [],
    };
  }

  return {
    status: "ok",
    media: json?.media,
  };
};
