# Conditional Rendering System

This system implements conditional rendering with three states based on localStorage data:
1. **HomeForm**: No booking data exists
2. **UserForm**: Booking data exists but no user details
3. **BookingSummary**: Complete booking with user details

## How it works:

### 1. ConditionalForm Component
- **Location**: `app/_components/ConditionalForm.js`
- **Purpose**: Main wrapper component that decides which component to render
- **Logic**: 
  - Checks localStorage for `bookingData` on mount
  - Listens for storage events and custom events
  - Renders appropriate component based on data state

### 2. Flow:
1. **Initial State**: HomeForm is displayed (no booking data in localStorage)
2. **User Completes Booking**: 
   - User goes through booking steps (location, hub, vehicle, addons)
   - When booking is submitted, data is saved to localStorage
   - Custom event `bookingDataChanged` is dispatched
   - ConditionalForm detects the change and switches to UserForm
3. **User Completes UserForm**:
   - User fills out personal information
   - On submit, user data is **appended** to existing booking data
   - Complete booking data is saved back to localStorage
   - ConditionalForm switches to BookingSummary
4. **BookingSummary**:
   - Shows confirmation with booking and user details
   - "Start New Booking" button clears localStorage and returns to HomeForm

### 3. Key Features:
- **Data Merging**: User form data is appended to existing booking data
- **Three-State System**: HomeForm → UserForm → BookingSummary
- **Real-time Updates**: Listens for localStorage changes across tabs
- **Loading State**: Shows spinner while checking localStorage
- **Error Handling**: Gracefully handles localStorage errors
- **Manual Reset**: "Start New Booking" button allows users to reset

### 4. Components Updated:
- `app/page.js`: Now uses ConditionalForm instead of HomeForm
- `app/UserDetails/page.js`: Now uses ConditionalForm
- `app/_components/Form.js`: Appends user data to booking data
- `app/_components/BookingSummary.js`: New component for completed bookings
- `app/_components/hooks/useBookingForm.js`: Dispatches custom events

### 5. localStorage Structure:
```javascript
{
  "bookingData": {
    // Booking information from the booking process
    pickupDate: "...",
    returnDate: "...",
    selectedVehicle: "...",
    selectedHub: "...",
    // User details (added after form submission)
    userDetails: {
      firstName: "...",
      lastName: "...",
      email: "...",
      cell: "...",
      address1: "...",
      city: "...",
      // ... other user fields
    },
    submittedAt: "2024-01-01T12:00:00.000Z"
  }
}
```

### 6. Events:
- `storage`: Fired when localStorage changes in other tabs
- `bookingDataChanged`: Custom event fired when booking data changes in same tab

### 7. Component States:
- **HomeForm**: `!hasBookingData && !hasCompletedBooking`
- **UserForm**: `hasBookingData && !hasCompletedBooking`
- **BookingSummary**: `hasCompletedBooking`

This system ensures a smooth user experience with proper data persistence and clear state management throughout the booking process. 