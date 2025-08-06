import { useMemo } from "react";

export function useFilteredCities(cities, state) {
  return useMemo(() => {
    if (!state || !cities) return [];
    return cities
      .filter((c) => c && c.state_Name === state && c.city_Name) // Filter out cities without city name
      .map((c) => ({ value: c.city_Name, label: c.city_Name }));
  }, [cities, state]);
}
