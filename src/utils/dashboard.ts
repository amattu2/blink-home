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
