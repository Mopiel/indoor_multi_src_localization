import GPS from "gps"
import SerialPort from "serialport"

export class GPSScanner {
    private gps = new GPS;
    private port;
    public constructor() {
        this.port = SerialPort("/dev/ttyACM0")
        this.port.on('data', data => {
            this.gps.updatePartial(data);
        })
    }
    public scanArea = () => {
        return new Promise((resolve) => {
            resolve(this.gps.state)
        })
    }
}
