"use client";
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SearchableSelect from "./SearchableSelect";

export default function ReturnLocationDialog({
    returnLocationType,
    onReturnLocationTypeChange,
    returnAirport,
    onReturnAirportChange,
    returnState,
    onReturnStateChange,
    returnCity,
    onReturnCityChange,
    airportOptions,
    stateOptions,
    filteredReturnCities,
    errors,
    hasError
}) {
    const [open, setOpen] = useState(false);

    const handleTypeSelect = (type) => {
        onReturnLocationTypeChange(type);
        // Keep dialog open to allow selection
    };

    const getButtonText = () => {
        if (returnLocationType === "airport") {
            return returnAirport || "Select Return Airport";
        } else if (returnLocationType === "state") {
            if (returnState && returnCity) {
                return `${returnState} / ${returnCity}`;
            } else if (returnState) {
                return `${returnState} / Select City`;
            } else {
                return "Select Return State / City";
            }
        } else {
            return "Select Return Location";
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button 
                    type="button"
                    className={`btn btn-outline-primary w-100 py-3 px-4 fw-medium rounded-3 border-2 ${hasError ? "border-danger text-danger bg-light" : "border-secondary"}`}
                >
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {getButtonText()}
                </button>
            </DialogTrigger>

            <DialogContent className="p-0 border-0 shadow-lg rounded-4 bg-white" style={{ maxWidth: "500px" }}>
                {/* Header */}
                <DialogHeader className="bg-primary text-white rounded-top-4 p-4 m-0">
                    <DialogTitle className="h5 mb-0">
                        <i className="fas fa-location-arrow me-2"></i>
                        Select Return Location
                    </DialogTitle>
                </DialogHeader>

                {/* Body */}
                <div className="p-4 bg-white">
                    {/* Location Type Selection */}
                    <div className="mb-4">
                        <label className="form-label fw-bold text-dark mb-3">
                            <i className="fas fa-route me-2 text-primary"></i>
                            Choose Location Type
                        </label>
                        <div className="d-flex gap-3">
                            <button
                                type="button"
                                className={`btn ${returnLocationType === "airport" ? "btn-primary" : "btn-outline-primary"} flex-fill py-3 px-4 fw-medium rounded-3`}
                                onClick={() => handleTypeSelect("airport")}
                            >
                                <i className="fas fa-plane me-2"></i>
                                Airport
                            </button>
                            <button
                                type="button"
                                className={`btn ${returnLocationType === "state" ? "btn-primary" : "btn-outline-primary"} flex-fill py-3 px-4 fw-medium rounded-3`}
                                onClick={() => handleTypeSelect("state")}
                            >
                                <i className="fas fa-city me-2"></i>
                                State / City
                            </button>
                        </div>
                    </div>

                    {/* Current Selection Display */}
                    <div className="alert alert-info mb-4 rounded-3 border-0 bg-light">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-info-circle me-2 text-primary"></i>
                            <div>
                                <strong className="d-block">Current Selection:</strong>
                                <span className="text-muted">
                                    {!returnLocationType
                                        ? "Please select a location type above"
                                        : returnLocationType === "airport"
                                            ? returnAirport || "No airport selected"
                                            : `${returnState || "No state selected"} / ${returnCity || "No city selected"}`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Airport Selection */}
                    {returnLocationType === "airport" && (
                        <div className="mb-3">
                            <SearchableSelect
                                label="Return Airport"
                                options={airportOptions}
                                value={returnAirport}
                                onChange={onReturnAirportChange}
                                className="mb-0"
                            />
                        </div>
                    )}

                    {/* State/City Selection */}
                    {returnLocationType === "state" && (
                        <div>
                            <div className="mb-3">
                                <SearchableSelect
                                    label="Return State"
                                    options={stateOptions}
                                    value={returnState}
                                    onChange={onReturnStateChange}
                                    className="mb-0"
                                />
                            </div>
                            <div className="mb-3">
                                <SearchableSelect
                                    label="Return City"
                                    options={filteredReturnCities}
                                    value={returnCity}
                                    onChange={onReturnCityChange}
                                    className="mb-0"
                                />
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {hasError && (
                        <div className="alert alert-danger mt-3 rounded-3 border-0">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            Please select a valid return location
                        </div>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="bg-light rounded-bottom-4 p-3 m-0">
                    <DialogClose asChild>
                        <button 
                            type="button" 
                            className="btn btn-outline-secondary me-2 py-2 px-3 fw-medium rounded-3"
                        >
                            <i className="fas fa-times me-2"></i>
                            Cancel
                        </button>
                    </DialogClose>
                    <DialogClose asChild>
                        <button 
                            type="button" 
                            className="btn btn-primary py-2 px-4 fw-medium rounded-3"
                        >
                            <i className="fas fa-check me-2"></i>
                            Confirm Selection
                        </button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
