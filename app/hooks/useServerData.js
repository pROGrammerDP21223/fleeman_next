'use server';

import { cache } from 'react';

// Cache the data fetching function
export const getCities = cache(async () => {
  try {
    const response = await fetch('https://your-api.com/cities', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
});

export const getVehicles = cache(async () => {
  try {
    const response = await fetch('https://your-api.com/vehicles', {
      next: { revalidate: 1800 } // Cache for 30 minutes
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch vehicles');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }
});

export const getAirports = cache(async () => {
  try {
    const response = await fetch('https://your-api.com/airports', {
      next: { revalidate: 7200 } // Cache for 2 hours
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch airports');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching airports:', error);
    return [];
  }
});

export const getHubs = cache(async (location) => {
  try {
    const response = await fetch(`https://your-api.com/hubs?location=${location}`, {
      next: { revalidate: 900 } // Cache for 15 minutes
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch hubs');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching hubs:', error);
    return [];
  }
}); 