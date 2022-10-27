import fs from "fs"
import { devices } from "./devices"

type DataType = {
    cords: { x: number, y: number }
    wifiDevices: { mac: string, rssi: number }[]
    bleDevices: { address: string, rssi: number }[]
}

const devicesMatrix = ["x", "y", ...Object.values(devices.bleDevices), ...Object.values(devices.wifiDevices)]

const readData = (name: string, extraData: unknown[] = []) => {
    fs.readdir(name, (e, files) => {
        if (e) {
            return console.error(e)
        }
        const data = files.map(filePath => JSON.parse(fs.readFileSync(`${name}/${filePath}`, { encoding: 'utf8', flag: 'r' })) as DataType)
        const mappedData = data.map(value => {
            const wifi = value.wifiDevices.reduce((p, c) => ({ ...p, [c.mac]: c.rssi }), {})
            const ble = value.bleDevices.reduce((p, c) => ({ ...p, [c.address]: c.rssi }), {})
            return {
                ...value.cords,
                ...wifi,
                ...ble
            }
        })
        const array = [...mappedData, ...extraData].map(value => {
            return devicesMatrix.map(key => value[key] === undefined ? -100 : value[key])
        })
        const exportArray: string[][] = [
            // devicesMatrix, 
            ...array
        ]
        const strToExport = exportArray.map(a => a.join(",")).join("\r\n")
        fs.writeFileSync(`${name}.csv`, strToExport)
    })
}
readData("data_test")
readData("data_con")