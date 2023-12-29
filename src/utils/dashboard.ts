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
 * @returns The total number of devices
 */
export const getDeviceCount = (homescreen: Homescreen): number => {
  let count = 0;

  if (homescreen?.doorbells) {
    count += homescreen.doorbells.length;
  }

  if (homescreen?.owls) {
    count += homescreen.owls.length;
  }

  if (homescreen?.sync_modules) {
    count += homescreen.sync_modules.length;
  }

  return count;
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
    default:
      return source || "Unknown";
  }
};
