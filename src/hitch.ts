const AirPorts = {
  ATX: [30.2672, -97.7431],
  DAL: [32.8969, -97.0384],
  HOU: [29.6454, -95.2789],
};

export enum DriverStatus { OFFLINE, AVAILABLE, IN_PROGRESS }

interface Driver {
    id: string;
    status: DriverStatus; 
    location: number[];
}

export class Hitch {
    drivers: Driver[];

    constructor(drivers: Driver[]) {
        this.drivers = drivers;
    }

    getRideQuote(pickupLocation: number[], dropOffLocation: number[]): number {
        const distance = this.calculateDistance(pickupLocation, dropOffLocation);
        return distance * this.calculateBaseCost() * this.calculateSurgeMultiplier(distance);
    }

    findClosestDriver(pickupLocation: number[]): Driver | null {
        return this.drivers.reduce((closest, driver) => {
            if (driver.status !== DriverStatus.AVAILABLE) return closest;
            const driverDistance = this.calculateDistance(pickupLocation, driver.location);
            return !closest || driverDistance < this.calculateDistance(pickupLocation, closest.location) ? driver : closest;
        }, null as Driver | null);
    }

    private calculateBaseCost(): number {
        return 0.50;
    }

    private calculateSurgeMultiplier(distance: number): number {
        let multiplier = 1 + this.timeOfDaySurge() + this.availableDriversSurge();
        if (distance > 20) multiplier -= 0.10;
        return Math.max(multiplier, 1);
    }

    private timeOfDaySurge(): number {
        const hour = new Date().getHours();
        return (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19) ? 0.25 : 0;
    }

    private availableDriversSurge(): number {
        return this.drivers.filter(driver => driver.status === DriverStatus.AVAILABLE).length < 5 ? 0.25 : 0;
    }

    private calculateDistance(loc1: number[], loc2: number[]): number {
        const milesPerDegree = 69;
        const dLat = Math.abs(loc1[0] - loc2[0]);
        const dLon = Math.abs(loc1[1] - loc2[1]);
        return Math.sqrt(dLat ** 2 + dLon ** 2) * milesPerDegree;
    }
}