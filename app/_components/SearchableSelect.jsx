"use client";

import * as React from "react";

export default function SearchableSelect({
  label,
  options,
  value,
  onChange,
  className,
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [filteredOptions, setFilteredOptions] = React.useState([]);
  const dropdownRef = React.useRef(null);

  // Ensure options is an array before filtering
  const safeOptions = Array.isArray(options) ? options : [];
  
  // Filter options by search
  React.useEffect(() => {
    const filtered = safeOptions.filter((option) => {
      if (!option.label) return false;
      return option.label.toLowerCase().includes(search.toLowerCase());
    });
    setFilteredOptions(filtered);
  }, [search, safeOptions]);

  const selectedLabel = safeOptions.find((option) => option.value === value)?.label || "";

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue === value ? "" : selectedValue);
    setOpen(false);
    setSearch("");
  };

  const handleToggle = () => {
    setOpen(!open);
    if (!open) {
      setSearch("");
    }
  };

  return (
    <div className={className} ref={dropdownRef}>
      <label className="form-label fw-medium text-dark mb-2">{label}</label>
      <div className="position-relative">
        <button
          type="button"
          className="btn btn-outline-secondary w-100 text-start py-2 px-3 d-flex align-items-center justify-content-between"
          onClick={handleToggle}
          style={{ minHeight: "38px" }}
        >
          <span className="text-truncate">
            {selectedLabel || `Select ${(label || '').toLowerCase()}...`}
          </span>
          <i className={`fas fa-chevron-down ms-2 transition-transform ${open ? 'rotate-180' : ''}`}></i>
        </button>

        {open && (
          <div className="position-absolute w-100 mt-1 bg-white border rounded-3 shadow-lg" style={{ zIndex: 1050, maxHeight: "200px" }}>
            {/* Search Input */}
            <div className="p-2 border-bottom">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder={`Search ${(label || '').toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>

            {/* Options List */}
            <div className="overflow-auto" style={{ maxHeight: "150px" }}>
              {filteredOptions.length === 0 ? (
                <div className="p-3 text-muted text-center">
                  <i className="fas fa-search me-2"></i>
                  No {(label || '').toLowerCase()} found.
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between py-2 px-3 border-0 ${
                        value === option.value ? 'bg-primary text-white' : 'hover-bg-light'
                      }`}
                      onClick={() => handleSelect(option.value)}
                    >
                      <span className="text-truncate">{option.label || 'Unnamed Option'}</span>
                      {value === option.value && (
                        <i className="fas fa-check ms-2"></i>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
