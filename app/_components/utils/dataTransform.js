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

  // Find hub by ID - handle both string and number types
  const selectedHub = hubs.find(hub => {
    return hub.location_Id === formData.selectedHub || 
           hub.location_Id === parseInt(formData.selectedHub);
  });
  const hubId = selectedHub ? selectedHub.location_Id : formData.selectedHub;

  // Find return hub by ID - handle both string and number types
  // If return location is not enabled, return hub is same as pickup hub
  let returnHubId;
  if (formData.returnLocationEnabled) {
    const selectedReturnHub = returnHubs.find(hub => {
      return hub.location_Id === formData.selectedReturnHub || 
             hub.location_Id === parseInt(formData.selectedReturnHub);
    });
    returnHubId = selectedReturnHub ? selectedReturnHub.location_Id : formData.selectedReturnHub;
  } else {
    // When return location is not enabled, return hub is same as pickup hub
    returnHubId = hubId;
  }

  // Find vehicle by ID - handle both string and number types
  const selectedVehicle = vehicles.find(vehicle => 
    vehicle.vehicleId === formData.selectedVehicleId || 
    vehicle.vehicleId === parseInt(formData.selectedVehicleId)
  );
  const vehicleId = selectedVehicle ? selectedVehicle.vehicleId : formData.selectedVehicleId;

  // Find addon IDs - handle both string and number types
  const selectedAddonIds = formData.selectedAddons.map(addonId => {
    const addon = addons.find(addon => 
      addon.addOnId === addonId || 
      addon.addOnId === parseInt(addonId)
    );
    return addon ? addon.addOnId : addonId;
  });

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
    selectedHub: hubId,
    selectedReturnHub: returnHubId,
    selectedVehicle: vehicleId,
    selectedAddons: selectedAddonIds,
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