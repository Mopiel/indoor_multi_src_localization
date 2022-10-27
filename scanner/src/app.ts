import fs from "fs"
import { BluettothScanner } from "./bleScanner"
import readlineAsync from "readline-async"
import { WifiScanner } from "./wifiScanner"
import { GPSScanner } from "./gpsScanner"

const writeToFile = (name: string, data: unknown) => {
    fs.writeFile(name, JSON.stringify(data, null, 2), (err) => err && console.error(err.message))
}

const bluettothScanner = new BluettothScanner()
const wifiScanner = new WifiScanner()
const gpsScanner = new GPSScanner()

const scan5 = async (cords: { x: number, y: number }, callback: () => void = () => { }) => {
    for(let i=0;i<5;i++){
        await scan(cords)
    }
    callback()
}

const scan = async (cords: { x: number, y: number }, callback: () => void = () => { }) => {
    const bleDevicesPromise = bluettothScanner.scanArea()
    const wifiDevicesPromise = wifiScanner.scanArea()
    const gpsDevicesPromise = gpsScanner.scanArea()
    const date = (new Date).toISOString()
    await Promise.all([bleDevicesPromise, wifiDevicesPromise, gpsDevicesPromise]).then(([bleDevices, wifiDevices, gpsDevices]) => {
        writeToFile(
            `data_many/devices_${date}.json`,
            {
                cords,
                date,
                wifiDevices,
                bleDevices,
                gpsDevices
            }
        )
        callback()
    })
}

const getCords = (str: string) => {
    const [strX, strY] = str.split(";")
    const [x, y] = [parseFloat(strX), parseFloat(strY)]
    if (!(isNaN(x) || isNaN(y))) {
        return { x, y }
    }
    return null;
}

const readline = () => {
    console.clear()
    console.log("Write command:")
    console.log("'q' to exit")
    console.log("'x;y' to search for devices in this location")
    readlineAsync()
        .then(line => {
            if (line == "q") {
                process.exit(1)
            }
            const cords = getCords(line)
            if (cords) {
                scan5(cords, readline)
            } else {
                console.clear()
                console.log("Wrong value")
                setTimeout(() => readline(), 1000)
            }
        })
}

readline()