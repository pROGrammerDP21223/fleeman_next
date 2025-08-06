export const BOOKING_STEPS = {
  LOCATION: 1,
  HUB: 2,
  VEHICLE: 3,
  ADDONS: 4,
};

export const LOCATION_TYPES = {
  AIRPORT: "airport",
  STATE: "state",
};



export const VALIDATION_MESSAGES = {
  PICKUP_DATE_REQUIRED: "Pickup date/time is required.",
  RETURN_DATE_REQUIRED: "Return date/time is required.",
  RETURN_DATE_BEFORE_PICKUP: "Return date/time cannot be before pickup date/time.",
  PICKUP_LOCATION_TYPE_REQUIRED: "Please select a pickup location type.",
  PICKUP_AIRPORT_REQUIRED: "Pickup airport is required.",
  PICKUP_STATE_REQUIRED: "Pickup state is required.",
  PICKUP_CITY_REQUIRED: "Pickup city is required.",
  RETURN_AIRPORT_REQUIRED: "Return airport is required.",
  RETURN_STATE_REQUIRED: "Return state is required.",
  RETURN_CITY_REQUIRED: "Return city is required.",
  RETURN_LOCATION_TYPE_REQUIRED: "Return location type is required.",
  HUB_SELECTION_REQUIRED: "Please select a hub.",
  VEHICLE_SELECTION_REQUIRED: "Please select a car.",
};

export const API_ENDPOINTS = {
  CITIES: "/cities",
  AIRPORTS: "/airports",
}; 