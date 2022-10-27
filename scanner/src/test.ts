import nobel from "noble";
import { devices } from "./devices"

const beacons: { [key: string]: number } = Object.values(devices.bleDevices).reduce((p, c) => ({
    ...p,
    [c]: -110
}), {})

let counter = 0

nobel.startScanning([], true);
nobel.on('discover', function (beacon) {
    if (beacons[beacon.address]) {
        beacons[beacon.address] = beacon.rssi
        console.clear()
        console.log(beacons)
        console.log(`counter = ${counter}`)
    }
    
});

setInterval(() => {
    counter += 1
    Object.keys(beacons).forEach(key =>
        beacons[key] = -110
    )
}, 10000)

