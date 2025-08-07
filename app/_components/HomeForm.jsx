"use client";
import React, { useState, useMemo, useCallback } from "react";
import { useFetchData } from "../hooks/useFetchData";
import { useFilteredCities } from "../hooks/useFilteredCities";
import { useBookingForm } from "./hooks/useBookingForm";
import { fetchCities, fetchAirports, fetchVehicles, fetchAddons } from "../api/api";
import { transformAirportsToOptions, transformCitiesToStateOptions } from "./utils/dataTransform";
import Step1LocationForm from "./BookingSteps/Step1LocationForm";
import Step2HubSelection from "./BookingSteps/Step2HubSelection";
import Step3VehicleSelection from "./BookingSteps/Step3VehicleSelection";
import Step4AddonSelection from "./BookingSteps/Step4AddonSelection";
import ErrorBoundary from "./ErrorBoundary";
import '../Styles/HomeForm.css';

export default function HomeForm() {
    // Fetch data
    const { data: citiesAPI } = useFetchData(fetchCities);
    const { data: airportsAPI } = useFetchData(fetchAirports);
    const { data: vehiclesData } = useFetchData(fetchVehicles);
    const { data: addonsData } = useFetchData(fetchAddons);

    // Booking form logic
    const bookingForm = useBookingForm(vehiclesData, addonsData);

    // Memoized derived data
    const airportOptions = useMemo(() => 
        transformAirportsToOptions(airportsAPI), 
        [airportsAPI]
    );

    const stateOptions = useMemo(() => 
        transformCitiesToStateOptions(citiesAPI), 
        [citiesAPI]
    );

    const filteredPickupCities = useFilteredCities(citiesAPI, bookingForm.pickupState);
    const filteredReturnCities = useFilteredCities(citiesAPI, bookingForm.returnState);

    // Animation state
    const [animationDirection, setAnimationDirection] = useState('forward');
    const [isAnimating, setIsAnimating] = useState(false);

    // Handle step transitions with animation
    const handleStepTransition = useCallback((newStep, direction = 'forward') => {
        setAnimationDirection(direction);
        setIsAnimating(true);
        
        setTimeout(() => {
            if (direction === 'forward') {
                bookingForm.handleNext();
            } else {
                bookingForm.handleBack();
            }
            setIsAnimating(false);
        }, 300); // Match CSS transition duration
    }, [bookingForm]);

    // Override the original handlers to include animation
    const animatedHandleNext = useCallback(() => {
        handleStepTransition(bookingForm.step + 1, 'forward');
    }, [bookingForm.step, handleStepTransition]);

    const animatedHandleBack = useCallback(() => {
        handleStepTransition(bookingForm.step - 1, 'backward');
    }, [bookingForm.step, handleStepTransition]);

    const animatedHandleSubmit = useCallback(() => {
        handleStepTransition(4, 'forward');
    }, [handleStepTransition]);

    return (
        <div className="w-100" >

  <ErrorBoundary>
         <div className="section-search ">
      <div className="container">
        <div className="search-box-banner shadow">

                {bookingForm.step === 1 && (
                    <Step1LocationForm
                        pickupDate={bookingForm.pickupDate}
                        returnDate={bookingForm.returnDate}
                        pickupLocationType={bookingForm.pickupLocationType}
                        pickupAirport={bookingForm.pickupAirport}
                        pickupState={bookingForm.pickupState}
                        pickupCity={bookingForm.pickupCity}
                        returnLocationEnabled={bookingForm.returnLocationEnabled}
                        returnLocationType={bookingForm.returnLocationType}
                        returnAirport={bookingForm.returnAirport}
                        returnState={bookingForm.returnState}
                        returnCity={bookingForm.returnCity}
                        airportOptions={airportOptions}
                        stateOptions={stateOptions}
                        filteredPickupCities={filteredPickupCities}
                        filteredReturnCities={filteredReturnCities}
                        errors={bookingForm.errors}
                        onPickupDateChange={bookingForm.handlePickupDateChange}
                        onReturnDateChange={bookingForm.handleReturnDateChange}
                        onPickupLocationTypeChange={bookingForm.handlePickupLocationTypeChange}
                        onPickupAirportChange={bookingForm.handlePickupAirportChange}
                        onPickupStateChange={bookingForm.handlePickupStateChange}
                        onPickupCityChange={bookingForm.handlePickupCityChange}
                        onReturnLocationEnabledChange={bookingForm.handleReturnLocationEnabledChange}
                        onReturnLocationTypeChange={bookingForm.handleReturnLocationTypeChange}
                        onReturnAirportChange={bookingForm.handleReturnAirportChange}
                        onReturnStateChange={bookingForm.handleReturnStateChange}
                        onReturnCityChange={bookingForm.handleReturnCityChange}
                        onSubmit={animatedHandleNext}
                    />
                )}

                {bookingForm.step === 2 && (
                    <Step2HubSelection
                        hubs={bookingForm.hubs}
                        selectedHub={bookingForm.selectedHub}
                        loadingHubs={bookingForm.loadingHubs}
                        hubError={bookingForm.hubError}
                        onHubSelect={bookingForm.handleHubSelect}
                        onBack={animatedHandleBack}
                        onNext={animatedHandleNext}
                        returnHubs={bookingForm.returnHubs}
                        selectedReturnHub={bookingForm.selectedReturnHub}
                        onReturnHubSelect={bookingForm.handleReturnHubSelect}
                        loadingReturnHubs={bookingForm.loadingReturnHubs}
                        returnHubError={bookingForm.returnHubError}
                        returnLocationEnabled={bookingForm.returnLocationEnabled}
                    />
                )}

                {bookingForm.step === 3 && (
                    <Step3VehicleSelection
                        vehicles={vehiclesData}
                        selectedVehicleId={bookingForm.selectedVehicleId}
                        onVehicleSelect={bookingForm.handleVehicleSelect}
                        onBack={animatedHandleBack}
                        onNext={animatedHandleNext}
                    />
                )}

                {bookingForm.step === 4 && (
                    <Step4AddonSelection
                        addons={addonsData}
                        selectedAddons={bookingForm.selectedAddons}
                        onAddonToggle={bookingForm.handleAddonToggle}
                        onBack={animatedHandleBack}
                        onSubmit={bookingForm.handleSubmit}
                    />
                )}
            </div></div>
        </div>
        </ErrorBoundary>

        </div>

      
    );
}
