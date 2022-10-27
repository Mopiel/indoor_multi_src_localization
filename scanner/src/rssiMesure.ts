import readlineAsync from "readline-async"
import nobel from "noble";
import { devices } from "./devices"

const beacons: { [key: string]: number } = Object.values(devices.bleDevices).reduce((p, c) => ({
    ...p,
    [c]: -110
}), {})

nobel.startScanning([], true);
nobel.on('discover', function (beacon) {
    if (beacons[beacon.address] !== undefined) {
        beacons[beacon.address] = beacon.rssi
    }
});

const beaconKey = "dc:0d:30:00:02:65"

const measurements = []

const readline = () => {
    console.clear()
    console.log("Write command:")
    console.log("measurements",measurements)
    console.log("'q' to exit")
    console.log("'x' to search for devices in this location")
    readlineAsync()
        .then(line => {
            if (line == "q") {
                console.log("measurements",measurements)
                process.exit(1)
            }
            const num = Number(line)
            if (!isNaN(num)) {
                measurements.push({cord: num,rssi:beacons[beaconKey]})
                Object.keys(beacons).forEach(key =>
                    beacons[key] = null
                )
                readline()
            } else {
                console.clear()
                console.log("Wrong value")
                setTimeout(() => readline(), 1000)
            }
        })
}

readline()