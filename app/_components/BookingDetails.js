import React from 'react';

const BookingDetails = ({ bookingData }) => {
  if (!bookingData) return <div>No Booking Data</div>;

  return (
    <div>
      <h2>Booking Details</h2>
      <p>
        {Object.entries(bookingData).map(([key, value]) => (
            <span key={key}>
                <strong>{key}:</strong> {String(value)}<br />
            </span>
        ))}
      </p>
    </div>
  );
};

export default BookingDetails;