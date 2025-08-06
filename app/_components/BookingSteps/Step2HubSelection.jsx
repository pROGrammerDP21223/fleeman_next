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
  returnHubError
}) {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
         
            <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
              <div className="align-items-center">
                {/* Hub Selection */}
                <div className="row" style={{ width: '100%' }}>
                  <div className="input-block">
                    <label>Select Hub</label>
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
                                    selectedHub === String(hubId)
                                      ? "border-primary bg-primary bg-opacity-10 shadow"
                                      : "border-secondary hover:border-primary"
                                  }`}
                                  onClick={() => onHubSelect(String(hubId))}
                                >
                                  <div className="card-body">
                                    <div className="row">
                                      <div className="col-auto">
                                        <input
                                          type="radio"
                                          name="hub"
                                          value={hubId}
                                          checked={selectedHub === String(hubId)}
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

                        {/* Return Hub Selection (if provided) */}
                        {Array.isArray(returnHubs) && (
                          <div className="mt-5">
                            <label className="fw-bold mb-2">Select Return Hub</label>
                            {loadingReturnHubs ? (
                              <div className="text-center py-4">
                                <LoadingSpinner size="lg" />
                                <span className="ms-3 fs-5 fw-medium">Loading return hubs...</span>
                              </div>
                            ) : returnHubError ? (
                              <div className="text-center text-danger py-2">{returnHubError}</div>
                            ) : (
                              <div className="row g-3">
                                {returnHubs.length > 0 ? (
                                  returnHubs.map((hub) => (
                                    <div key={hub.location_Id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                      <div
                                        className={`card h-100 cursor-pointer transition-all ${
                                          selectedReturnHub === String(hub.location_Id)
                                            ? "border-primary bg-primary bg-opacity-10 shadow"
                                            : "border-secondary hover:border-primary"
                                        }`}
                                        onClick={() => onReturnHubSelect(String(hub.location_Id))}
                                      >
                                        <div className="card-body">
                                          <div className="row">
                                            <div className="col-auto">
                                              <input
                                                type="radio"
                                                name="returnHub"
                                                value={hub.location_Id}
                                                checked={selectedReturnHub === String(hub.location_Id)}
                                                onChange={(e) => onReturnHubSelect(e.target.value)}
                                                className="form-check-input mt-1"
                                              />
                                            </div>
                                            <div className="col">
                                              <h5 className="card-title fw-bold mb-2 text-dark">{hub.location_Name}</h5>
                                              {hub.address && (
                                                <div className="mb-2">
                                                  <p className="card-text text-muted mb-1 small">{hub.address}</p>
                                                  {hub.city && (
                                                    <p className="card-text text-muted small mb-1">{hub.city}</p>
                                                  )}
                                                  {hub.airport && (
                                                    <p className="card-text text-muted small mb-1">{hub.airport}</p>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))
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
                              disabled={(!selectedHub || loadingHubs) || (Array.isArray(returnHubs) && returnHubs.length > 0 && (!selectedReturnHub || loadingReturnHubs))}
                              className={`btn px-4 py-2 fw-semibold w-100 ${
                                selectedHub && !loadingHubs && (!Array.isArray(returnHubs) || returnHubs.length === 0 || (selectedReturnHub && !loadingReturnHubs))
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