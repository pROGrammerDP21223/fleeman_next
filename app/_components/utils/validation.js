import { VALIDATION_MESSAGES } from "../constants/booking";

export function validatePickupDate(value, returnDate) {
  if (!value) return VALIDATION_MESSAGES.PICKUP_DATE_REQUIRED;
  if (returnDate && new Date(returnDate) < new Date(value)) {
    return VALIDATION_MESSAGES.RETURN_DATE_BEFORE_PICKUP;
  }
  return null;
}

export function validateReturnDate(value, pickupDate) {
  if (!value) return VALIDATION_MESSAGES.RETURN_DATE_REQUIRED;
  if (pickupDate && new Date(value) < new Date(pickupDate)) {
    return VALIDATION_MESSAGES.RETURN_DATE_BEFORE_PICKUP;
  }
  return null;
}

export function validatePickupLocationType(value) {
  if (!value) {
    return VALIDATION_MESSAGES.PICKUP_LOCATION_TYPE_REQUIRED;
  }
  return null;
}

export function validatePickupAirport(value, pickupLocationType) {
  if (pickupLocationType === "airport" && !value) {
    return VALIDATION_MESSAGES.PICKUP_AIRPORT_REQUIRED;
  }
  return null;
}

export function validatePickupState(value, pickupLocationType) {
  if (pickupLocationType === "state" && !value) {
    return VALIDATION_MESSAGES.PICKUP_STATE_REQUIRED;
  }
  return null;
}

export function validatePickupCity(value, pickupLocationType) {
  if (pickupLocationType === "state" && !value) {
    return VALIDATION_MESSAGES.PICKUP_CITY_REQUIRED;
  }
  return null;
}

export function validateReturnLocationType(value, returnLocationEnabled) {
  if (returnLocationEnabled && !value) {
    return VALIDATION_MESSAGES.RETURN_LOCATION_TYPE_REQUIRED;
  }
  return null;
}

export function validateReturnAirport(value, returnLocationEnabled, returnLocationType) {
  if (returnLocationEnabled && returnLocationType === "airport" && !value) {
    return VALIDATION_MESSAGES.RETURN_AIRPORT_REQUIRED;
  }
  return null;
}

export function validateReturnState(value, returnLocationEnabled, returnLocationType) {
  if (returnLocationEnabled && returnLocationType === "state" && !value) {
    return VALIDATION_MESSAGES.RETURN_STATE_REQUIRED;
  }
  return null;
}

export function validateReturnCity(value, returnLocationEnabled, returnLocationType) {
  if (returnLocationEnabled && returnLocationType === "state" && !value) {
    return VALIDATION_MESSAGES.RETURN_CITY_REQUIRED;
  }
  return null;
}

export function validateAllFields(formData) {
  const errors = {};
  
  // Validate pickup date
  const pickupDateError = validatePickupDate(formData.pickupDate, formData.returnDate);
  if (pickupDateError) errors.pickupDate = pickupDateError;
  
  // Validate return date
  const returnDateError = validateReturnDate(formData.returnDate, formData.pickupDate);
  if (returnDateError) errors.returnDate = returnDateError;
  
  // Validate pickup location type first
  const pickupLocationTypeError = validatePickupLocationType(formData.pickupLocationType);
  if (pickupLocationTypeError) errors.pickupLocationType = pickupLocationTypeError;
  
  // Validate pickup location fields only if location type is selected
  if (formData.pickupLocationType) {
    const pickupAirportError = validatePickupAirport(formData.pickupAirport, formData.pickupLocationType);
    if (pickupAirportError) errors.pickupAirport = pickupAirportError;
    
    const pickupStateError = validatePickupState(formData.pickupState, formData.pickupLocationType);
    if (pickupStateError) errors.pickupState = pickupStateError;
    
    const pickupCityError = validatePickupCity(formData.pickupCity, formData.pickupLocationType);
    if (pickupCityError) errors.pickupCity = pickupCityError;
  }
  
  // Validate return location if enabled
  if (formData.returnLocationEnabled) {
    // Validate return location type first
    const returnLocationTypeError = validateReturnLocationType(formData.returnLocationType, formData.returnLocationEnabled);
    if (returnLocationTypeError) errors.returnLocationType = returnLocationTypeError;
    
    // Validate return location fields only if location type is selected
    if (formData.returnLocationType) {
      const returnAirportError = validateReturnAirport(formData.returnAirport, formData.returnLocationEnabled, formData.returnLocationType);
      if (returnAirportError) errors.returnAirport = returnAirportError;
      
      const returnStateError = validateReturnState(formData.returnState, formData.returnLocationEnabled, formData.returnLocationType);
      if (returnStateError) errors.returnState = returnStateError;
      
      const returnCityError = validateReturnCity(formData.returnCity, formData.returnLocationEnabled, formData.returnLocationType);
      if (returnCityError) errors.returnCity = returnCityError;
    }
  }
  
  return errors;
} 