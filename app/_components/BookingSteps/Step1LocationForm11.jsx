"use client";
import React from "react";
import SearchableSelect from "../SearchableSelect";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import PickupLocationDialog from "../PickupLocationDialog";
import ReturnLocationDialog from "../ReturnLocationDialog";

export default function Step1LocationForm({
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
  airportOptions,
  stateOptions,
  filteredPickupCities,
  filteredReturnCities,
  errors,
  onPickupDateChange,
  onReturnDateChange,
  onPickupLocationTypeChange,
  onPickupAirportChange,
  onPickupStateChange,
  onPickupCityChange,
  onReturnLocationEnabledChange,
  onReturnLocationTypeChange,
  onReturnAirportChange,
  onReturnStateChange,
  onReturnCityChange,
  onSubmit
}) {
  return (
    <div className="search-box-banner">
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <ul className="align-items-center">
          {/* Pickup Date */}
          <li className="column-group-main">
            <div className={`input-block date-widget ${errors.pickupDate ? 'error' : ''}`}>
              <label htmlFor="pickup-date">Pickup Date and Time</label>
              <div className="input-icon-wrapper">
                <Calendar className="input-icon" />
                <input
                  id="pickup-date"
                  type="datetime-local"
                  className="form-control datetimepicker"
                  value={pickupDate}
                  onChange={onPickupDateChange}
                />
              </div>
            </div>
            {errors.pickupDate && <p className="error-text">{errors.pickupDate}</p>}
          </li>

          {/* Return Date */}
          <li className="column-group-main">
            <div className={`input-block date-widget ${errors.returnDate ? 'error' : ''}`}>
              <label htmlFor="return-date">Return Date and Time</label>
              <div className="input-icon-wrapper">
                <Calendar className="input-icon" />
                <input
                  id="return-date"
                  type="datetime-local"
                  className="form-control datetimepicker"
                  value={returnDate}
                  min={pickupDate}
                  onChange={onReturnDateChange}
                />
              </div>
            </div>
            {errors.returnDate && <p className="error-text">{errors.returnDate}</p>}
          </li>

          {/* Pickup Location */}
          <li className="column-group-main">
            <div className={`input-block ${errors.pickupLocationType || errors.pickupAirport || errors.pickupState || errors.pickupCity ? 'error' : ''}`}>
              <label>Pickup Location</label>
              <PickupLocationDialog
                pickupLocationType={pickupLocationType}
                pickupAirport={pickupAirport}
                pickupState={pickupState}
                pickupCity={pickupCity}
                airportOptions={airportOptions}
                stateOptions={stateOptions}
                filteredPickupCities={filteredPickupCities}
                errors={errors}
                onPickupLocationTypeChange={onPickupLocationTypeChange}
                onPickupAirportChange={onPickupAirportChange}
                onPickupStateChange={onPickupStateChange}
                onPickupCityChange={onPickupCityChange}
                hasError={!!(errors.pickupLocationType || errors.pickupAirport || errors.pickupState || errors.pickupCity)}
              />
            </div>
            {(errors.pickupLocationType || errors.pickupAirport || errors.pickupState || errors.pickupCity) && (
              <p className="error-text">
                {errors.pickupLocationType || "Please select a pickup location"}
              </p>
            )}
          </li>

          {/* Return Location Toggle */}
          <li className="column-group-main" style={{ width: '100%' }}>
            <input
              type="checkbox"
              id="change-return-location"
              checked={returnLocationEnabled}
              onChange={onReturnLocationEnabledChange}
            />
            <label htmlFor="change-return-location">Change Return Location</label>
          </li>

          {/* Return Location Dialog */}
          {returnLocationEnabled && (
            <li className="column-group-main" style={{ width: '100%' }}>
              <div className={`input-block ${errors.returnLocationType || errors.returnAirport || errors.returnState || errors.returnCity ? 'error' : ''}`}>
                <label>Return Location</label>
                <ReturnLocationDialog
                  returnLocationType={returnLocationType}
                  returnAirport={returnAirport}
                  returnState={returnState}
                  returnCity={returnCity}
                  airportOptions={airportOptions}
                  stateOptions={stateOptions}
                  filteredReturnCities={filteredReturnCities}
                  errors={errors}
                  onReturnLocationTypeChange={onReturnLocationTypeChange}
                  onReturnAirportChange={onReturnAirportChange}
                  onReturnStateChange={onReturnStateChange}
                  onReturnCityChange={onReturnCityChange}
                  hasError={!!(errors.returnLocationType || errors.returnAirport || errors.returnState || errors.returnCity)}
                />
              </div>
              {(errors.returnLocationType || errors.returnAirport || errors.returnState || errors.returnCity) && (
                <p className="error-text">
                  {errors.returnLocationType || "Please select a return location"}
                </p>
              )}
            </li>
          )}

          {/* Submit Button */}
          <li className="column-group-last" style={{ width: '100%' }}>
            <div className="input-block">
              <button className="d-flex gap-2 align-items-center btn search-button" type="submit">
                Next
              </button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
} 