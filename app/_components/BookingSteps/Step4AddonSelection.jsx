"use client";
import React from "react";
import { Button } from "../../../components/ui/button";

export default function Step4AddonSelection({
  addons,
  selectedAddons,
  onAddonToggle,
  onBack,
  onSubmit
}) {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
            <div className="align-items-center">
              {/* Addon Selection */}
              <div className="row" style={{ width: '100%' }}>
                <div className="input-block">
                  <label>Select Add-ons</label>
                  {addons?.length > 0 ? (
                    <div className="container-fluid">
                      {/* First Row - Addon Cards */}
                      <div className="row g-3">
                        {addons.map((addon) => (
                          <div key={addon.addOnId} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div
                              className={`card h-100 cursor-pointer transition-all ${
                                selectedAddons.includes(addon.addOnId)
                                  ? "border-primary bg-primary bg-opacity-10 shadow"
                                  : "border-secondary hover:border-primary"
                              }`}
                              onClick={() => {
                                const id = addon.addOnId;
                                if (selectedAddons.includes(id)) {
                                  onAddonToggle(selectedAddons.filter((item) => item !== id));
                                } else {
                                  onAddonToggle([...selectedAddons, id]);
                                }
                              }}
                            >
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-auto">
                                    <input
                                      type="checkbox"
                                      value={addon.addOnId}
                                      checked={selectedAddons.includes(addon.addOnId)}
                                      onChange={(e) => {
                                        const id = e.target.value;
                                        if (e.target.checked) {
                                          onAddonToggle([...selectedAddons, id]);
                                        } else {
                                          onAddonToggle(selectedAddons.filter((item) => item !== id));
                                        }
                                      }}
                                      className="form-check-input mt-1"
                                    />
                                  </div>
                                  <div className="col">
                                    <div className="row">
                                      <div className="col">
                                        <h5 className="card-title fw-bold mb-2 text-dark">{addon.addOnName}</h5>
                                        {addon.description && (
                                          <p className="card-text text-muted small mb-2">{addon.description}</p>
                                        )}
                                      </div>
                                      <div className="col-auto">
                                        <span className="badge bg-primary fs-6">${addon.addOnPrice}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
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
                            onClick={onSubmit}
                            className="btn btn-primary px-4 py-2 fw-semibold w-100"
                            type="button"
                          >
                            Submit →
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-12 text-center text-muted fst-italic">
                          No add-ons available.
                        </div>
                      </div>
                      {/* Navigation Buttons for No Add-ons */}
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
                            onClick={onSubmit}
                            className="btn btn-primary px-4 py-2 fw-semibold w-100"
                            type="button"
                          >
                            Submit →
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