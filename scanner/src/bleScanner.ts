import nobel from "noble";

export class BluettothScanner {
    public scanArea = (timeout = 10000) => {
        nobel.startScanning([], true);
        const beacons = {}

        nobel.on('discover', function (bleacon) {
            beacons[bleacon.address] = {
                id: bleacon.id,
                address: bleacon.address,
                rssi: bleacon.rssi,
                date: (new Date).toISOString()
            }

        });
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(Object.values(beacons).sort((a: any, b: any) => (a.rssi - b.rssi)))
                // nobel.stopScanning()
            }, timeout)
        })
    }
}