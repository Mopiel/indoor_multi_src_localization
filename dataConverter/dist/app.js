"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const devices_1 = require("./devices");
const devicesMatrix = ["x", "y", ...Object.values(devices_1.devices.bleDevices), ...Object.values(devices_1.devices.wifiDevices)];
const readData = (name, extraData = []) => {
    fs_1.default.readdir(name, (e, files) => {
        if (e) {
            return console.error(e);
        }
        const data = files.map(filePath => JSON.parse(fs_1.default.readFileSync(`${name}/${filePath}`, { encoding: 'utf8', flag: 'r' })));
        const mappedData = data.map(value => {
            const wifi = value.wifiDevices.reduce((p, c) => (Object.assign(Object.assign({}, p), { [c.mac]: c.rssi })), {});
            const ble = value.bleDevices.reduce((p, c) => (Object.assign(Object.assign({}, p), { [c.address]: c.rssi })), {});
            return Object.assign(Object.assign(Object.assign({}, value.cords), wifi), ble);
        });
        const array = [...mappedData, ...extraData].map(value => {
            return devicesMatrix.map(key => value[key] === undefined ? -100 : value[key]);
        });
        const exportArray = [
            // devicesMatrix, 
            ...array
        ];
        const strToExport = exportArray.map(a => a.join(",")).join("\r\n");
        fs_1.default.writeFileSync(`${name}.csv`, strToExport);
    });
};
readData("data_test");
readData("data_con");
//# sourceMappingURL=app.js.map