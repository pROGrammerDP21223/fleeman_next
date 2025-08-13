# Addon ID vs Name Mapping

## Overview

The application stores **addon IDs** in sessionStorage and databases for data consistency, while displaying **addon names** in the UI for better user experience.

## ✅ Current Implementation

### 🔧 **Storage Strategy:**
- **SessionStorage**: Stores addon IDs as strings (e.g., `['1', '3', '5']`)
- **Database**: Uses numeric addon IDs for foreign key relationships
- **Form State**: Maintains addon IDs for consistency

### 🎨 **Display Strategy:**
- **UI**: Shows addon names (e.g., "GPS Navigation", "Child Seat")
- **Cards**: Displays addon descriptions and prices
- **Selection**: Visual feedback shows selected addon names

## 📊 **Addon ID Reference**

Based on typical car rental addons, the application uses these ID mappings:

| Addon ID | Addon Name | Typical Price | Description |
|----------|------------|---------------|-------------|
| `'1'` | GPS Navigation | $15/day | Satellite navigation system |
| `'2'` | Additional Driver | $10/day | Add extra authorized driver |
| `'3'` | Child Seat | $8/day | Safety seat for children |
| `'4'` | WiFi Hotspot | $12/day | Mobile internet connection |
| `'5'` | Premium Insurance | $25/day | Comprehensive coverage |
| `'6'` | Ski Rack | $15/day | Equipment for winter sports |
| `'7'` | Roadside Assistance | $8/day | 24/7 emergency support |

## 🔧 **Implementation Details**

### **Form Handling (Modify Booking)**
```javascript
// Addon selection stores IDs as strings
const isSelected = formData.selectedAddons.includes(String(addon.addOnId));

// When toggling addons
const updatedAddons = isSelected
  ? formData.selectedAddons.filter(id => id !== String(addon.addOnId))
  : [...formData.selectedAddons, String(addon.addOnId)];
```

### **SessionStorage Format**
```javascript
{
  "selectedAddons": ["1", "3", "5"], // GPS, Child Seat, Premium Insurance
  "userDetails": { /* ... */ },
  // ... other booking data
}
```

### **Display in UI**
```javascript
// Shows addon names, not IDs
<strong>{addon.addOnName}</strong>
{addon.description && <div className="small text-muted">{addon.description}</div>}
{addon.addOnPrice && <div className="small text-success fw-bold">${addon.addOnPrice}</div>}
```



## 🛠️ **Data Transformation Utilities**

The application includes utility functions for converting between IDs and names:

```javascript
// From app/_components/utils/dataTransform.js
export function getAddonNamesByIds(addonIds = [], addons = []) {
  return addonIds.map(addonId => {
    const addon = addons.find(addon => 
      addon.addOnId === addonId || 
      addon.addOnId === parseInt(addonId)
    );
    return addon ? addon.addOnName : addonId;
  });
}
```

## ✅ **Benefits of This Approach**

### **Data Integrity**
- 🔐 **Consistent IDs**: Database relationships remain stable
- 🔐 **Type Safety**: Numeric IDs prevent naming conflicts
- 🔐 **Scalability**: Easy to add/remove addons without breaking references

### **User Experience**
- 👁️ **Readable Names**: Users see "GPS Navigation" not "1"
- 👁️ **Rich Content**: Descriptions and prices enhance understanding
- 👁️ **Multilingual**: Names can be localized, IDs remain constant

### **Development**
- 🔧 **API Compatibility**: Works with existing backend systems
- 🔧 **Form Consistency**: Same ID format across all components
- 🔧 **Easy Testing**: Predictable ID patterns for automation

## 🧪 **Testing Addon Selection**

### **Verify ID Storage:**
1. Select addons in modify booking form
2. Open browser developer tools
3. Check `sessionStorage.getItem('bookingData')`
4. Confirm `selectedAddons` contains string IDs like `['1', '3']`

### **Verify Name Display:**
1. Select addons in modify booking form
2. Check that addon names appear in UI (not IDs)
3. Verify descriptions and prices show correctly

### **Test Persistence:**
1. Select addons and update booking
2. Navigate to booking summary
3. Confirm addon names display correctly
4. Verify sessionStorage still contains IDs

## 🔄 **Migration Notes**

If upgrading from name-based storage to ID-based:

### **Data Migration**
```javascript
// Convert existing name-based data to ID-based
const nameToIdMap = {
  'gps': '1',
  'child-seat': '3',
  'wifi': '4',
  'premium-insurance': '5',
  'additional-driver': '2'
};

// Migration function
function migrateAddonData(existingData) {
  if (existingData.selectedAddons) {
    existingData.selectedAddons = existingData.selectedAddons.map(
      addon => nameToIdMap[addon] || addon
    );
  }
  return existingData;
}
```

## 📝 **Summary**

The current implementation correctly:
- ✅ **Stores addon IDs** in sessionStorage and databases
- ✅ **Displays addon names** in the UI for users
- ✅ **Maintains consistency** across all form components
- ✅ **Provides fallback handling** for both numeric and string IDs
- ✅ **Includes utility functions** for ID/name conversion

This approach ensures data integrity while maintaining excellent user experience.
