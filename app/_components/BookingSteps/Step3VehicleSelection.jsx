"use client";
import React from "react";
import { Button } from "../../../components/ui/button";

export default function Step3VehicleSelection({
  vehicles,
  selectedVehicleId,
  onVehicleSelect,
  onBack,
  onNext
}) {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
            <div className="align-items-center">
              {/* Vehicle Selection */}
              <div className="row" style={{ width: '100%' }}>
                <div className="input-block">
                  <label>Select Car</label>
                  {vehicles?.length > 0 ? (
                    <div className="container-fluid">
                      {/* First Row - Vehicle Cards */}
                      <div className="row g-3">
                        {vehicles.map((vehicle) => {
                          const isSelected = selectedVehicleId === vehicle.vehicleId;
                          return (
                            <div key={vehicle.vehicleId} className="col-12 col-sm-6 col-md-4 col-lg-3">
                              <div
                                className={`card h-100 cursor-pointer transition-all ${
                                  isSelected
                                    ? "border-primary bg-primary bg-opacity-10 shadow"
                                    : "border-secondary hover:border-primary"
                                }`}
                                onClick={() => onVehicleSelect(vehicle.vehicleId)}
                              >
                                <div className="card-body">
                                  <div className="row">
                                    <div className="col-auto">
                                      <input
                                        type="radio"
                                        name="vehicle"
                                        value={vehicle.vehicleId}
                                        checked={isSelected}
                                        onChange={() => onVehicleSelect(vehicle.vehicleId)}
                                        className="form-check-input mt-1"
                                      />
                                    </div>
                                    <div className="col">
                                      <div className="row">
                                        <div className="col-auto">
                                          <img
                                            src={vehicle.imgPath}
                                            alt={vehicle.vehicleType}
                                            className="img-fluid rounded"
                                            style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                                          />
                                        </div>
                                        <div className="col">
                                          <h5 className="card-title fw-bold mb-2 text-dark">{vehicle.vehicleType}</h5>
                                        </div>
                                      </div>

                                      {isSelected && (
                                        <div className="mt-3">
                                          <h6 className="fw-semibold mb-2 text-primary">Rate Information:</h6>
                                          <div className="row g-2">
                                            <div className="col-12">
                                              <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                                                <span className="small fw-medium">Daily Rate:</span>
                                                <span className="small text-success fw-bold">${vehicle.dailyRate}</span>
                                              </div>
                                            </div>
                                            <div className="col-12">
                                              <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                                                <span className="small fw-medium">Weekly Rate:</span>
                                                <span className="small text-success fw-bold">${vehicle.weeklyRate}</span>
                                              </div>
                                            </div>
                                            <div className="col-12">
                                              <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                                                <span className="small fw-medium">Monthly Rate:</span>
                                                <span className="small text-success fw-bold">${vehicle.monthlyRate}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

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
                            className="btn btn-primary px-4 py-2 fw-semibold w-100"
                            type="button"
                          >
                            Next →
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-12 text-center text-muted fst-italic">
                          No vehicles available.
                        </div>
                      </div>
                      {/* Navigation Buttons for No Vehicles */}
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
                            disabled={true}
                            className="btn btn-secondary disabled px-4 py-2 fw-semibold w-100"
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