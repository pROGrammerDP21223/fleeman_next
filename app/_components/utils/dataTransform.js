export function transformAirportsToOptions(airports) {
  if (!airports || !Array.isArray(airports)) return [];
  return airports
    .filter(airport => airport && airport.airport_Code) // Filter out airports without codes
    .map(airport => ({ 
      value: airport.airport_Code, 
      label: airport.airport_Name 
    }));
}

export function transformCitiesToStateOptions(cities) {
  if (!cities || !Array.isArray(cities)) return [];
  
  const stateMap = new Map();
  cities
    .filter(city => city && city.state_Name) // Filter out cities without state
    .forEach(city => {
      if (!stateMap.has(city.state_Name)) {
        stateMap.set(city.state_Name, { value: city.state_Name, label: city.state_Name });
      }
    });
  
  return Array.from(stateMap.values());
}

export function transformCitiesToCityOptions(cities, selectedState) {
  if (!cities || !Array.isArray(cities) || !selectedState) return [];
  
  return cities
    .filter(city => city && city.state_Name === selectedState && city.city_Name) // Filter out cities without city name
    .map(city => ({ 
      value: city.city_Name, 
      label: city.city_Name 
    }));
}

export function createLocationObject(type, value, state, city) {
  if (type === "airport") {
    return { type: "airport", value }; // value will now be the airport code
  }
  return { type: "city", state, city };
}

// Utility function to get vehicle name by ID
export function getVehicleNameById(vehicleId, vehicles = []) {
  if (!vehicleId) return 'N/A';
  const vehicle = vehicles.find(vehicle => 
    vehicle.vehicleId === vehicleId || 
    vehicle.vehicleId === parseInt(vehicleId)
  );
  return vehicle ? vehicle.vehicleType : vehicleId;
}

// Utility function to get addon names by IDs
export function getAddonNamesByIds(addonIds = [], addons = []) {
  if (!addonIds || !Array.isArray(addonIds)) return [];
  return addonIds.map(addonId => {
    const addon = addons.find(addon => 
      addon.addOnId === addonId || 
      addon.addOnId === parseInt(addonId)
    );
    return addon ? addon.addOnName : addonId;
  });
}

// Utility function to get hub name by ID
export function getHubNameById(hubId, hubs = []) {
  if (!hubId) return 'N/A';
  const hub = hubs.find(hub => 
    hub.location_Id === hubId || 
    hub.location_Id === parseInt(hubId)
  );
  return hub ? hub.location_Name : hubId;
}

export function prepareBookingData(formData, hubs = [], vehicles = [], addons = [], returnHubs = []) {
  const pickupLocation = createLocationObject(
    formData.pickupLocationType,
    formData.pickupAirport, // This will now be the airport code
    formData.pickupState,
    formData.pickupCity
  );

  const returnLocation = formData.returnLocationEnabled
    ? createLocationObject(
        formData.returnLocationType,
        formData.returnAirport, // This will now be the airport code
        formData.returnState,
        formData.returnCity
      )
    : pickupLocation;

  // Store hub name instead of ID
  const selectedHubName = formData.selectedHub;

  // Store return hub name instead of ID
  let selectedReturnHubName;
  if (formData.returnLocationEnabled) {
    selectedReturnHubName = formData.selectedReturnHub;
  } else {
    // When return location is not enabled, return hub is same as pickup hub
    selectedReturnHubName = selectedHubName;
  }

  // Store vehicle ID instead of name
  const selectedVehicleId = formData.selectedVehicleId;

  // Store addon IDs instead of names
  const selectedAddonIds = formData.selectedAddons;

  // Format dates to match backend expectation (yyyy-MM-dd'T'HH:mm)
  const formatDateForBackend = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return {
    pickupDate: formatDateForBackend(formData.pickupDate),
    returnDate: formatDateForBackend(formData.returnDate),
    pickupLocation,
    returnLocation,
    selectedHub: selectedHubName, // Store name instead of ID
    selectedReturnHub: selectedReturnHubName, // Store name instead of ID
    selectedVehicle: selectedVehicleId, // Store ID instead of name
    selectedAddons: selectedAddonIds, // Store IDs instead of names
  };
}

export function transformLocationApiResponseToHubs(apiResponse) {
  if (!apiResponse || !Array.isArray(apiResponse.locationNames)) return [];
  return apiResponse.locationNames.map((loc, idx) => ({
    location_Id: `${apiResponse.airport || ''}_${idx}`,
    location_Name: loc.name,
    address: loc.address,
    city: apiResponse.city,
    airport: apiResponse.airport
  }));
} 