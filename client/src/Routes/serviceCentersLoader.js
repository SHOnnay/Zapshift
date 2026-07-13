// Shared across the rider, sendparcel, and coverage routes so the same
// service-centers dataset isn't re-fetched on every navigation.
let cachedServiceCenters = null;

export const serviceCentersLoader = async () => {
  if (cachedServiceCenters) return cachedServiceCenters;

  const res = await fetch('/serviceCenters.json');
  if (!res.ok) throw new Response('Failed to load service centers', { status: res.status });

  cachedServiceCenters = await res.json();
  return cachedServiceCenters;
};