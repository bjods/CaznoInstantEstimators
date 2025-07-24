import { DriveTimeConfig, DriveTimePricing } from '@/types'

export interface DistanceResult {
  distance: number // in miles
  duration: number // in minutes
  status: 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR'
}

export interface DriveTimeCost {
  distance: number
  duration: number
  cost: number
  description: string
  withinFreeRadius: boolean
}

/**
 * Calculate distance and drive time between two addresses using Google Maps Distance Matrix API
 */
export async function calculateDistance(
  origin: string, 
  destination: string
): Promise<DistanceResult> {
  try {
    // For development/testing, we'll use a mock calculation
    // In production, this would use Google Maps Distance Matrix API
    if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      return mockDistanceCalculation(origin, destination)
    }

    const service = new google.maps.DistanceMatrixService()
    
    return new Promise((resolve, reject) => {
      service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
        avoidTolls: false
      }, (response, status) => {
        if (status === google.maps.DistanceMatrixStatus.OK && response) {
          const element = response.rows[0]?.elements[0]
          
          if (element && element.status === 'OK') {
            const distanceInMiles = element.distance!.value * 0.000621371 // Convert meters to miles
            const durationInMinutes = element.duration!.value / 60 // Convert seconds to minutes
            
            resolve({
              distance: Math.round(distanceInMiles * 100) / 100, // Round to 2 decimal places
              duration: Math.round(durationInMinutes),
              status: 'OK'
            })
          } else {
            resolve({
              distance: 0,
              duration: 0,
              status: element?.status as any || 'UNKNOWN_ERROR'
            })
          }
        } else {
          resolve({
            distance: 0,
            duration: 0,
            status: status as any
          })
        }
      })
    })
  } catch (error) {
    console.error('Distance calculation error:', error)
    return {
      distance: 0,
      duration: 0,
      status: 'UNKNOWN_ERROR'
    }
  }
}

/**
 * Mock distance calculation for development/testing
 */
function mockDistanceCalculation(origin: string, destination: string): DistanceResult {
  // Simple mock that estimates distance based on string similarity
  // In reality, you'd want more sophisticated mocking or use actual coordinates
  
  if (!origin || !destination || origin === destination) {
    return { distance: 0, duration: 0, status: 'OK' }
  }
  
  // Mock calculation: assume 1 mile per "address difference unit"
  const mockDistance = Math.random() * 50 + 5 // 5-55 miles
  const mockDuration = mockDistance * 1.5 + Math.random() * 10 // Roughly 1.5 min per mile + traffic
  
  return {
    distance: Math.round(mockDistance * 100) / 100,
    duration: Math.round(mockDuration),
    status: 'OK'
  }
}

/**
 * Calculate drive time cost based on distance and pricing configuration
 */
export function calculateDriveTimeCost(
  distance: number,
  duration: number,
  driveTimeConfig: DriveTimeConfig
): DriveTimeCost {
  const { pricing } = driveTimeConfig
  
  // Check if within free radius
  const withinFreeRadius = pricing.freeRadius ? distance <= pricing.freeRadius : false
  
  if (withinFreeRadius) {
    return {
      distance,
      duration,
      cost: 0,
      description: `Free delivery within ${pricing.freeRadius} miles`,
      withinFreeRadius: true
    }
  }
  
  // Check if exceeds maximum distance
  if (pricing.maxDistance && distance > pricing.maxDistance) {
    return {
      distance,
      duration,
      cost: 0,
      description: `Service not available beyond ${pricing.maxDistance} miles`,
      withinFreeRadius: false
    }
  }
  
  let cost = 0
  let description = ''
  
  switch (pricing.type) {
    case 'perMile':
      const billableDistance = pricing.freeRadius 
        ? Math.max(0, distance - pricing.freeRadius)
        : distance
      cost = billableDistance * (pricing.rate || 0)
      description = `Drive time: ${distance} miles × $${pricing.rate}/mile`
      if (pricing.freeRadius) {
        description = `Drive time: ${billableDistance} billable miles × $${pricing.rate}/mile (${pricing.freeRadius} miles free)`
      }
      break
      
    case 'perMinute':
      cost = duration * (pricing.rate || 0)
      description = `Drive time: ${duration} minutes × $${pricing.rate}/minute`
      break
      
    case 'tiered':
      if (pricing.tiers) {
        const tier = pricing.tiers.find(t => 
          distance >= t.minDistance && 
          (t.maxDistance === undefined || distance <= t.maxDistance)
        )
        
        if (tier) {
          cost = tier.rate
          const maxText = tier.maxDistance ? `-${tier.maxDistance}` : '+'
          description = `Drive time: ${tier.minDistance}${maxText} mile zone - $${tier.rate}`
        }
      }
      break
  }
  
  return {
    distance,
    duration,
    cost: Math.round(cost * 100) / 100, // Round to nearest cent
    description,
    withinFreeRadius: false
  }
}

/**
 * Get drive time cost for pricing calculator integration
 */
export async function getDriveTimeCost(
  formData: Record<string, any>,
  driveTimeConfig: DriveTimeConfig
): Promise<DriveTimeCost | null> {
  if (!driveTimeConfig.enabled || !driveTimeConfig.yardAddress) {
    return null
  }
  
  const customerAddress = formData[driveTimeConfig.addressField]
  
  if (!customerAddress || typeof customerAddress !== 'string' || customerAddress.trim() === '') {
    return null
  }
  
  try {
    const distanceResult = await calculateDistance(
      driveTimeConfig.yardAddress,
      customerAddress.trim()
    )
    
    if (distanceResult.status !== 'OK') {
      console.warn('Drive time calculation failed:', distanceResult.status)
      return null
    }
    
    return calculateDriveTimeCost(
      distanceResult.distance,
      distanceResult.duration,
      driveTimeConfig
    )
  } catch (error) {
    console.error('Drive time calculation error:', error)
    return null
  }
}

/**
 * Format drive time cost for display
 */
export function formatDriveTimeCost(driveTimeCost: DriveTimeCost): string {
  if (driveTimeCost.withinFreeRadius) {
    return 'Free delivery'
  }
  
  if (driveTimeCost.cost === 0) {
    return 'Service not available'
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(driveTimeCost.cost)
}