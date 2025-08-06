"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { fetchHubs } from "../../api/api";
import { BOOKING_STEPS, VALIDATION_MESSAGES } from "../constants/booking";
import { validateAllFields, validatePickupDate, validateReturnDate, validatePickupLocationType, validatePickupAirport, validatePickupState, validatePickupCity, validateReturnLocationType, validateReturnAirport, validateReturnState, validateReturnCity } from "../utils/validation";
import { prepareBookingData } from "../utils/dataTransform";

export function useBookingForm(vehicles = [], addons = []) {
  // Form state
  const [step, setStep] = useState(BOOKING_STEPS.LOCATION);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pickupLocationType, setPickupLocationType] = useState("");
  const [pickupAirport, setPickupAirport] = useState("");
  const [pickupState, setPickupState] = useState("");
  const [pickupCity, setPickupCity] = useState("");
  const [returnLocationEnabled, setReturnLocationEnabled] = useState(false);
  const [returnLocationType, setReturnLocationType] = useState("");
  const [returnAirport, setReturnAirport] = useState("");
  const [returnState, setReturnState] = useState("");
  const [returnCity, setReturnCity] = useState("");
  const [selectedHub, setSelectedHub] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Hub state
  const [hubs, setHubs] = useState([]);
  const [loadingHubs, setLoadingHubs] = useState(false);
  const [hubError, setHubError] = useState("");

  // Memoized form data
  const formData = useMemo(() => ({
    pickupDate,
    returnDate,
    pickupLocationType,
    pickupAirport,
    pickupState,
    pickupCity,
    returnLocationEnabled,
    returnLocationType,
    returnAirport,
    returnState,
    returnCity,
    selectedHub,
    selectedVehicleId,
    selectedAddons,
  }), [
    pickupDate, returnDate, pickupLocationType, pickupAirport, pickupState, pickupCity,
    returnLocationEnabled, returnLocationType, returnAirport, returnState, returnCity,
    selectedHub, selectedVehicleId, selectedAddons
  ]);

  // Validation function
  const validateField = useCallback((name, value) => {
    const newErrors = { ...errors };
    let error = null;

    switch (name) {
      case "pickupDate":
        error = validatePickupDate(value, returnDate);
        break;
      case "returnDate":
        error = validateReturnDate(value, pickupDate);
        break;
      case "pickupLocationType":
        error = validatePickupLocationType(value);
        break;
      case "pickupAirport":
        error = validatePickupAirport(value, pickupLocationType);
        break;
      case "pickupState":
        error = validatePickupState(value, pickupLocationType);
        break;
      case "pickupCity":
        error = validatePickupCity(value, pickupLocationType);
        break;
      case "returnLocationType":
        error = validateReturnLocationType(value, returnLocationEnabled);
        break;
      case "returnAirport":
        error = validateReturnAirport(value, returnLocationEnabled, returnLocationType);
        break;
      case "returnState":
        error = validateReturnState(value, returnLocationEnabled, returnLocationType);
        break;
      case "returnCity":
        error = validateReturnCity(value, returnLocationEnabled, returnLocationType);
        break;
      default:
        break;
    }

    if (error) {
      newErrors[name] = error;
    } else {
      delete newErrors[name];
    }

    setErrors(newErrors);
  }, [errors, returnDate, pickupDate, pickupLocationType, returnLocationEnabled, returnLocationType]);

  // Event handlers with useCallback
  const handlePickupDateChange = useCallback((e) => {
    const value = e.target.value;
    setPickupDate(value);
    validateField("pickupDate", value);
  }, [validateField]);

  const handleReturnDateChange = useCallback((e) => {
    const value = e.target.value;
    setReturnDate(value);
    validateField("returnDate", value);
  }, [validateField]);

  const handlePickupLocationTypeChange = useCallback((value) => {
    setPickupLocationType(value);
    validateField("pickupLocationType", value);
  }, [validateField]);

  const handlePickupAirportChange = useCallback((value) => {
    setPickupAirport(value);
    validateField("pickupAirport", value);
  }, [validateField]);

  const handlePickupStateChange = useCallback((value) => {
    setPickupState(value);
    validateField("pickupState", value);
  }, [validateField]);

  const handlePickupCityChange = useCallback((value) => {
    setPickupCity(value);
    validateField("pickupCity", value);
  }, [validateField]);

  const handleReturnLocationEnabledChange = useCallback((e) => {
    const checked = e.target.checked;
    setReturnLocationEnabled(checked);
    if (!checked) {
      setReturnLocationType("");
      setReturnState("");
      setReturnCity("");
      setReturnAirport("");
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.returnLocationType;
        delete copy.returnState;
        delete copy.returnCity;
        delete copy.returnAirport;
        return copy;
      });
    }
  }, []);

  const handleReturnLocationTypeChange = useCallback((value) => {
    setReturnLocationType(value);
    validateField("returnLocationType", value);
  }, [validateField]);

  const handleReturnAirportChange = useCallback((value) => {
    setReturnAirport(value);
    validateField("returnAirport", value);
  }, [validateField]);

  const handleReturnStateChange = useCallback((value) => {
    setReturnState(value);
    validateField("returnState", value);
  }, [validateField]);

  const handleReturnCityChange = useCallback((value) => {
    setReturnCity(value);
    validateField("returnCity", value);
  }, [validateField]);

  const handleHubSelect = useCallback((value) => {
    setSelectedHub(value);
  }, []);

  const handleVehicleSelect = useCallback((vehicleId) => {
    setSelectedVehicleId(vehicleId);
  }, []);

  const handleAddonToggle = useCallback((newAddons) => {
    setSelectedAddons(newAddons);
  }, []);

  const handleBack = useCallback(() => {
    if (step > BOOKING_STEPS.LOCATION) {
      setStep(step - 1);
    }
  }, [step]);

  const handleNext = useCallback(() => {
    if (step === BOOKING_STEPS.LOCATION) {
      const newErrors = validateAllFields(formData);
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    } else if (step === BOOKING_STEPS.HUB) {
      if (!selectedHub) {
        toast.error(VALIDATION_MESSAGES.HUB_SELECTION_REQUIRED);
        return;
      }
    } else if (step === BOOKING_STEPS.VEHICLE) {
      if (!selectedVehicleId) {
        toast.error(VALIDATION_MESSAGES.VEHICLE_SELECTION_REQUIRED);
        return;
      }
    }
    setStep(step + 1);
  }, [step, formData, selectedHub, selectedVehicleId]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const newErrors = validateAllFields(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const bookingData = prepareBookingData(formData, hubs, vehicles, addons);

    // Clear any existing booking data and save new booking data
    // This ensures only one booking entry exists in localStorage
    localStorage.removeItem("bookingData");
    localStorage.setItem("bookingData", JSON.stringify(bookingData));

    // Dispatch custom event to notify ConditionalForm component
    window.dispatchEvent(new Event('bookingDataChanged'));

         toast("Booking successful!", {
       description: `Pickup on ${pickupDate}, Return on ${returnDate}`,
       action: {
         label: "Undo",
         onClick: () => console.log("Undo booking"),
       },
     });
     window.location.href = "/UserDetails";
  }, [formData, pickupDate, returnDate, hubs, vehicles, addons]);

  // Fetch hubs when step changes
  useEffect(() => {
    if (step === BOOKING_STEPS.HUB) {
      setLoadingHubs(true);
      setHubError("");
      const type = pickupLocationType === "airport" ? "airport" : "city";
      const value = type === "airport" ? pickupAirport : pickupCity;
      
      if (!value) {
        setHubError("Pickup location is missing.");
        setLoadingHubs(false);
        return;
      }

             fetchHubs(type, value)
         .then((data) => {
           setHubs(data);
           setLoadingHubs(false);
           
                       // If we're editing and have a selected hub name, find the corresponding ID
            if (isEditing && selectedHub && data.length > 0) {
              const hub = data.find(h => h.location_Name === selectedHub);
              if (hub) {
                setSelectedHub(hub.location_Id.toString());
              }
            }
         })
        .catch(() => {
          setHubError("Unable to fetch hubs. Please try again.");
          setLoadingHubs(false);
        });
    }
  }, [step, pickupLocationType, pickupAirport, pickupCity]);

  // Load existing booking data for editing

  // Reset dependent values when location type changes
  useEffect(() => {
    setPickupState("");
    setPickupCity("");
    setPickupAirport("");
    setReturnLocationEnabled(false);
    setReturnLocationType("");
    setReturnState("");
    setReturnCity("");
    setReturnAirport("");
    setErrors({});
  }, [pickupLocationType]);

  return {
    // State
    step,
    pickupDate,
    returnDate,
    pickupLocationType,
    pickupAirport,
    pickupState,
    pickupCity,
    returnLocationEnabled,
    returnLocationType,
    returnAirport,
    returnState,
    returnCity,
    selectedHub,
    selectedVehicleId,
    selectedAddons,
    errors,
    hubs,
    loadingHubs,
    hubError,
    isEditing,

    // Handlers
    handlePickupDateChange,
    handleReturnDateChange,
    handlePickupLocationTypeChange,
    handlePickupAirportChange,
    handlePickupStateChange,
    handlePickupCityChange,
    handleReturnLocationEnabledChange,
    handleReturnLocationTypeChange,
    handleReturnAirportChange,
    handleReturnStateChange,
    handleReturnCityChange,
    handleHubSelect,
    handleVehicleSelect,
    handleAddonToggle,
    handleBack,
    handleNext,
    handleSubmit,
  };
} 