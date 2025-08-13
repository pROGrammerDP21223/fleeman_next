"use client";
import React from "react";
import LoadingSpinner from "../LoadingSpinner";
import { Button } from "@/components/ui/button";

export default function Step2HubSelection({
  hubs,
  selectedHub,
  loadingHubs,
  hubError,
  onHubSelect,
  onBack,
  onNext,
  returnHubs,
  selectedReturnHub,
  onReturnHubSelect,
  loadingReturnHubs,
  returnHubError,
  returnLocationEnabled
}) {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          {returnLocationEnabled ? (
            <div className="alert alert-info mb-4 border-0 rounded-3">
              <i className="fas fa-info-circle me-2"></i>
              <strong>Return Location Enabled:</strong> You've selected a different return location. Please select both pickup and return hubs.
            </div>
          ) : (
            <div className="alert alert-success mb-4 border-0 rounded-3">
              <i className="fas fa-check-circle me-2"></i>
              <strong>Same Location:</strong> Return hub will be the same as pickup hub since you haven't selected a different return location.
            </div>
          )}
         
            <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
              <div className="align-items-center">
                {/* Pickup Hub Selection */}
                <div className="row" style={{ width: '100%' }}>
                  <div className="input-block">
                    <label className="fw-bold text-primary">Select Pickup Hub</label>
                    {loadingHubs ? (
                      <div className="text-center py-4">
                        <LoadingSpinner size="lg" />
                        <span className="ms-3 fs-5 fw-medium">Loading hubs...</span>
                      </div>
                    ) : hubError ? (
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-12">
                            <p className="error-text text-center">{hubError}</p>
                          </div>
                        </div>
                        {/* Navigation Buttons for Error State */}
                        <div className="row mt-4">
                          <div className="col-6">
                            <button
                              onClick={onBack}
                              className="btn btn-outline-secondary px-4 py-2 fw-semibold w-100"
                              type="button"
                            >
                              ← Back
                            </button>
                          </div>
                          <div className="col-6">
                            <button
                              onClick={onNext}
                              disabled={true}
                              className="btn btn-secondary disabled px-4 py-2 fw-semibold w-100"
                              type="button"
                            >
                              Next →
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="container-fluid">
                        {/* First Row - Hub Cards */}
                        <div className="row g-3">
                          {hubs.length > 0 ? (
                            hubs.map((hub) => {
                              // Handle the nested hub structure from the API
                              const hubId = hub.location_Id;
                              const hubName = hub.location_Name;
                              const hubAddress = hub.address;
                              const hubCity = hub.city && hub.city.city_Name;
                              const hubState = hub.state && hub.state.state_Name;
                              const hubZipCode = hub.zipCode || hub.zip_Code;
                              const hubPhone = hub.phone || hub.phone_Number;
                             
                              return (
                                <div key={hubId || `hub-${Math.random()}`} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                <div
                                  className={`card h-100 cursor-pointer transition-all ${
                                    selectedHub === hubName
                                      ? "border-primary bg-primary bg-opacity-10 shadow"
                                      : "border-secondary hover:border-primary"
                                  }`}
                                  onClick={() => onHubSelect(hubName)}
                                >
                                  <div className="card-body">
                                    <div className="row">
                                      <div className="col-auto">
                                        <input
                                          type="radio"
                                          name="hub"
                                          value={hubName}
                                          checked={selectedHub === hubName}
                                          onChange={(e) => onHubSelect(e.target.value)}
                                          className="form-check-input mt-1"
                                        />
                                      </div>
                                      <div className="col">
                                        <h5 className="card-title fw-bold mb-2 text-dark">{hubName}</h5>
                                        {hubAddress && (
                                          <div className="mb-2">
                                            <p className="card-text text-muted mb-1 small">{hubAddress}</p>
                                            {hubCity && hubState && (
                                              <p className="card-text text-muted small mb-1">{hubCity}, {hubState}</p>
                                            )}
                                            {hubZipCode && (
                                              <p className="card-text text-muted small">{hubZipCode}</p>
                                            )}
                                          </div>
                                        )}
                                        {hubPhone && (
                                          <p className="card-text text-primary fw-medium small mb-0">{hubPhone}</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              );
                            })
                          ) : (
                            <div className="col-12 text-center text-muted fst-italic">
                              No hubs available.
                            </div>
                          )}
                        </div>

                        {/* Return Hub Selection (only show when return location is enabled) */}
                        {returnLocationEnabled && (
                          <div className="mt-5">
                            <label className="fw-bold mb-2 text-success">Select Return Hub</label>
                            {loadingReturnHubs ? (
                              <div className="text-center py-4">
                                <LoadingSpinner size="lg" />
                                <span className="ms-3 fs-5 fw-medium">Loading return hubs...</span>
                              </div>
                            ) : returnHubError ? (
                              <div className="text-center text-danger py-2">{returnHubError}</div>
                            ) : (
                              <div className="row g-3">
                                {returnHubs && returnHubs.length > 0 ? (
                                  returnHubs.map((hub) => {
                                    // Handle the nested hub structure from the API
                                    const hubId = hub.location_Id;
                                    const hubName = hub.location_Name;
                                    const hubAddress = hub.address;
                                    const hubCity = hub.city && hub.city.city_Name;
                                    const hubState = hub.state && hub.state.state_Name;
                                    const hubZipCode = hub.zipCode || hub.zip_Code;
                                    const hubPhone = hub.phone || hub.phone_Number;
                                    
                                    return (
                                      <div key={hubId || `return-hub-${Math.random()}`} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                        <div
                                          className={`card h-100 cursor-pointer transition-all ${
                                            selectedReturnHub === hubName
                                              ? "border-primary bg-primary bg-opacity-10 shadow"
                                              : "border-secondary hover:border-primary"
                                          }`}
                                          onClick={() => onReturnHubSelect(hubName)}
                                        >
                                          <div className="card-body">
                                            <div className="row">
                                              <div className="col-auto">
                                                <input
                                                  type="radio"
                                                  name="returnHub"
                                                  value={hubName}
                                                  checked={selectedReturnHub === hubName}
                                                  onChange={(e) => onReturnHubSelect(e.target.value)}
                                                  className="form-check-input mt-1"
                                                />
                                              </div>
                                              <div className="col">
                                                <h5 className="card-title fw-bold mb-2 text-dark">{hubName}</h5>
                                                {hubAddress && (
                                                  <div className="mb-2">
                                                    <p className="card-text text-muted mb-1 small">{hubAddress}</p>
                                                    {hubCity && hubState && (
                                                      <p className="card-text text-muted small mb-1">{hubCity}, {hubState}</p>
                                                    )}
                                                    {hubZipCode && (
                                                      <p className="card-text text-muted small">{hubZipCode}</p>
                                                    )}
                                                  </div>
                                                )}
                                                {hubPhone && (
                                                  <p className="card-text text-primary fw-medium small mb-0">{hubPhone}</p>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="col-12 text-center text-muted py-2">No return hubs available for the selected location.</div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Second Row - Navigation Buttons */}
                        <div className="row mt-4">
                          <div className="col-3">
                            <button
                              onClick={onBack}
                              className="btn btn-outline-secondary px-4 py-2 fw-semibold w-100"
                              type="button"
                            >
                              ← Back
                            </button>
                          </div>
                          <div className="col-3">
                                                         <button
                               onClick={onNext}
                               disabled={!selectedHub || loadingHubs || (returnLocationEnabled && (!selectedReturnHub || loadingReturnHubs))}
                               className={`btn px-4 py-2 fw-semibold w-100 ${
                                 selectedHub && !loadingHubs && (!returnLocationEnabled || (selectedReturnHub && !loadingReturnHubs))
                                   ? "btn-primary"
                                   : "btn-secondary disabled"
                               }`}
                               type="button"
                             >
                               Next →
                             </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
} 