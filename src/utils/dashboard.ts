/**
 * Builds an array of BaseVisionDevice objects from the homescreen object
 * aggregated by network_id
 *
 * @param network_id The network_id to filter by
 * @param homescreen The homescreen object to aggregate from
 * @returns An array of BaseVisionDevice objects
 */
export const aggregateVisionDevices = (
  network_id: number,
  homescreen: Homescreen,
): BaseVisionDevice<unknown>[] => {
  const devices: BaseVisionDevice<unknown>[] = [];

  if (homescreen?.doorbells) {
    devices.push(
      ...homescreen.doorbells.filter((d) => d && d.network_id === network_id),
    );
  }

  if (homescreen?.owls) {
    devices.push(
      ...homescreen.owls.filter((d) => d && d.network_id === network_id),
    );
  }

  return devices;
};

/**
 * Calculates the total number of devices tied to a Blink account
 *
 * @param homescreen The homescreen object to aggregate from
 * @returns The total number of devices online and offline
 */
export const getDeviceCount = (
  homescreen: Homescreen,
): [total: number, offline: number] => {
  let totalCount = 0;
  let offlineCount = 0;

  if (homescreen?.doorbells) {
    totalCount += homescreen.doorbells.length;
    offlineCount += homescreen.doorbells.filter(
      (d) => d?.status !== "done",
    ).length;
  }

  if (homescreen?.owls) {
    totalCount += homescreen.owls.length;
    offlineCount += homescreen.owls.filter(
      (d) => d?.status !== "online",
    ).length;
  }

  if (homescreen?.sync_modules) {
    totalCount += homescreen.sync_modules.length;
    offlineCount += homescreen.sync_modules.filter(
      (d) => d?.status !== "online",
    ).length;
  }

  return [totalCount, offlineCount];
};

/**
 * Get the JavaScript date object for N days ago
 *
 * @param days The number of days ago
 * @returns The JavaScript date object
 */
export const getDateNDaysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

/**
 * Format a JavaScript date object to YYYY-MM-DD
 *
 * @param date The JavaScript date object
 * @returns The formatted date string
 */
export const formatYYYYMMDD = (date: Date): string =>
  date.toISOString().split("T")[0];

/**
 * Pretty formats the media event recording reason
 *
 * @param event The media event
 * @returns The pretty formatted recording reason
 */
export const getEventSource = (source: MediaEvent["source"]): string => {
  switch (source) {
    case "pir":
      return "Motion";
    case "liveview":
      return "Live View";
    case "button_press":
      return "Doorbell";
    case "snapshot":
      return "Snapshot";
    case "cv_motion":
      return "Person Detected";
    default:
      return source || "Unknown";
  }
};
