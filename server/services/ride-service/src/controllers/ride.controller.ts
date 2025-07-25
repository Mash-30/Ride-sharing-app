import { Request, Response } from 'express';
import Ride from '../models/Ride';
import { Types } from 'mongoose';

const BASE_FARE = 3; // Base fare in currency units
const PER_KM_RATE = 1.5; // Rate per kilometer
const PER_MINUTE_RATE = 0.25; // Rate per minute

// Haversine formula to calculate distance between two lat/lon points
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

export const estimateFare = async (req: Request, res: Response) => {
    const { pickup, dropoff } = req.body;

    if (!pickup || !dropoff || !pickup.coordinates || !dropoff.coordinates) {
        return res.status(400).json({ message: 'Pickup and dropoff coordinates are required' });
    }

    const [pickupLon, pickupLat] = pickup.coordinates;
    const [dropoffLon, dropoffLat] = dropoff.coordinates;

    try {
        // In a real app, you would use a service like Google Maps Directions API
        // to get a more accurate distance and estimated travel time.
        const distanceInKm = getDistance(pickupLat, pickupLon, dropoffLat, dropoffLon);
        const estimatedTimeInMinutes = distanceInKm * 2.5; // A simple estimation

        const distanceFare = distanceInKm * PER_KM_RATE;
        const timeFare = estimatedTimeInMinutes * PER_MINUTE_RATE;
        
        const estimatedFare = BASE_FARE + distanceFare + timeFare;

        res.status(200).json({
            estimatedFare: parseFloat(estimatedFare.toFixed(2)),
            distance: `${distanceInKm.toFixed(2)} km`,
            duration: `${Math.round(estimatedTimeInMinutes)} min`
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while estimating fare' });
    }
};

export const bookRide = async (req: Request, res: Response) => {
    // In a real app, userId would be extracted from an auth token
    const { userId, pickup, dropoff, pickupAddress, dropoffAddress, fare } = req.body;

    if (!userId || !pickup || !dropoff || !pickupAddress || !dropoffAddress || !fare) {
        return res.status(400).json({ message: 'Missing required booking information' });
    }

    try {
        const newRide = new Ride({
            userId: new Types.ObjectId(userId),
            pickupLocation: {
                type: 'Point',
                coordinates: pickup.coordinates
            },
            dropoffLocation: {
                type: 'Point',
                coordinates: dropoff.coordinates
            },
            pickupAddress,
            dropoffAddress,
            fare,
            status: 'pending',
        });

        await newRide.save();

        // Here you would trigger a background job to find a nearby driver
        
        res.status(201).json(newRide);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while booking ride' });
    }
}; 