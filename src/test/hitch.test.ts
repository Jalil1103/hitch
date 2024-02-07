import {Hitch,DriverStatus } from '../hitch';

describe('GIVEN a Hitch instance with several drivers in Texas', () => {
    let hitch: Hitch;
    beforeEach(() => {
        hitch = new Hitch([
            { id: "1", status: DriverStatus.AVAILABLE, location: [29.4241, -98.4936] }, // San Antonio
            { id: "2", status: DriverStatus.OFFLINE, location: [30.2672, -97.7431] }, // Austin
            { id: "3", status: DriverStatus.AVAILABLE, location: [29.7604, -95.3698] }, // Houston
            { id: "4", status: DriverStatus.AVAILABLE, location: [32.7767, -96.7970] }, // Dallas
        ]);
    });

    describe('WHEN getting a ride quote for a short distance within Austin', () => {
        it('THEN returns the expected cost without surge pricing', () => {
            const pickup = [30.2672, -97.7431];
            const dropOff = [30.2711, -97.7388];
            expect(hitch.getRideQuote(pickup, dropOff)).toBeCloseTo(0.25, 1);
        });
    });

    describe('WHEN getting a ride quote from San Antonio to Houston with few available drivers', () => {
        it('THEN returns the increased cost due to surge pricing', () => {
            jest.useFakeTimers('modern').setSystemTime(new Date('2024-02-02T08:00:00'));
            const pickup = [29.4241, -98.4936];
            const dropOff = [29.7604, -95.3698];
            expect(hitch.getRideQuote(pickup, dropOff)).toBeGreaterThan(98.5);
            jest.useRealTimers();
        });
    });

    describe('WHEN finding the closest available driver to a pickup location in Dallas', () => {
        it('THEN returns the closest driver who is available', () => {
            const pickup = [32.7767, -96.7970];
            const closestDriver = hitch.findClosestDriver(pickup);
            expect(closestDriver?.id).toBe("4");
        });
    });

    describe('AND when all drivers are offline', () => {
        beforeEach(() => {
            hitch = new Hitch([
                { id: "1", status: DriverStatus.OFFLINE, location: [29.4241, -98.4936] },
                { id: "2", status: DriverStatus.OFFLINE, location: [30.2672, -97.7431] },
                { id: "3", status: DriverStatus.OFFLINE, location: [29.7604, -95.3698] },
                { id: "4", status: DriverStatus.OFFLINE, location: [32.7767, -96.7970] },
            ]);
        });

        it('THEN findClosestDriver returns null', () => {
            const pickup = [32.7767, -96.7970];
            expect(hitch.findClosestDriver(pickup)).toBeNull();
        });
    });
});

describe('GIVEN a Hitch instance with drivers at varying distances', () => {
    let hitch: Hitch;
    beforeEach(() => {
        hitch = new Hitch([
            { id: "1", status: DriverStatus.AVAILABLE, location: [29.4241, -98.4936] },
            { id: "2", status: DriverStatus.AVAILABLE, location: [30.2672, -97.7431] },
            { id: "5", status: DriverStatus.AVAILABLE, location: [29.7604, -95.3698] },
        ]);
    });

    it('THEN returns the driver closest to the pickup location', () => {
        const pickup = [30.2672, -97.7431];
        const closestDriver = hitch.findClosestDriver(pickup);
        expect(closestDriver?.id).toBe("2");
    });
});

describe('GIVEN a Hitch instance during peak and off-peak hours', () => {
    let hitch: Hitch;
    beforeEach(() => {
        hitch = new Hitch([
            { id: "1", status: DriverStatus.AVAILABLE, location: [29.4241, -98.4936] },
        ]);
    });

    it('THEN includes a timeOfDaySurge in the price during peak hours', () => {
        jest.useFakeTimers('modern').setSystemTime(new Date('2024-02-02T08:00:00'));
        const pickup = [29.4241, -98.4936];
        const dropOff = [29.4260, -98.4861];
        const quoteDuringPeak = hitch.getRideQuote(pickup, dropOff);
        jest.useRealTimers();
        expect(quoteDuringPeak).toBeGreaterThan(0.5);
    });

    it('THEN does not include a timeOfDaySurge in the price during off-peak hours', () => {
        jest.useFakeTimers('modern').setSystemTime(new Date('2024-02-02T22:00:00'));
        const pickup = [29.4241, -98.4936];
        const dropOff = [29.4260, -98.4861];
        const quoteDuringOffPeak = hitch.getRideQuote(pickup, dropOff);
        jest.useRealTimers();
        expect(quoteDuringOffPeak).toBeCloseTo(0.50, 1);
    });
});

describe('GIVEN a Hitch instance with varying numbers of available drivers', () => {
    let hitchFewDrivers: Hitch;
    let hitchManyDrivers: Hitch;
    beforeEach(() => {
        hitchFewDrivers = new Hitch([
            { id: "1", status: DriverStatus.AVAILABLE, location: [29.4241, -98.4936] },
        ]);

        hitchManyDrivers = new Hitch([
            { id: "1", status: DriverStatus.AVAILABLE, location: [29.4241, -98.4936] },
            { id: "2", status: DriverStatus.AVAILABLE, location: [30.2672, -97.7431] },
            { id: "3", status: DriverStatus.AVAILABLE, location: [29.7604, -95.3698] },
            { id: "4", status: DriverStatus.AVAILABLE, location: [32.7767, -96.7970] },
            { id: "5", status: DriverStatus.AVAILABLE, location: [32.7767, -96.7970] },
        ]);
    });

    it('THEN applies an availableDriversSurge when fewer than 5 drivers are available', () => {
        const pickup = [29.4241, -98.4936];
        const dropOff = [29.4260, -98.4861];
        const quoteWithFewDrivers = hitchFewDrivers.getRideQuote(pickup, dropOff);
        expect(quoteWithFewDrivers).toBeGreaterThan(0.50);
    });

    it('THEN does not apply an availableDriversSurge when 5 or more drivers are available', () => {
        const pickup = [29.4241, -98.4936];
        const dropOff = [29.4260, -98.4861];
        const expectedCost = 0.2669238936478486; 
        expect(hitchManyDrivers.getRideQuote(pickup, dropOff)).toBeCloseTo(expectedCost, 1);
    });
});

